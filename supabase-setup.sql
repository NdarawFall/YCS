-- ATTENTION : Aucun commentaire ne doit être présent dans ce fichier. Ce fichier est exclusivement réservé aux commandes SQL pures. Pour ajouter d'autres commandes sur instructions, ajouter une ligne de tiret (----) puis en dessous la ou les commandes.

----

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.is_workspace_member(UUID, UUID) CASCADE;
DROP FUNCTION IF EXISTS public.is_team_member_or_owner(UUID, UUID) CASCADE;
DROP TABLE IF EXISTS public.videos CASCADE;
DROP TABLE IF EXISTS public.team_members CASCADE;
DROP TABLE IF EXISTS public.teams CASCADE;
DROP TABLE IF EXISTS public.workspaces CASCADE;
DROP TABLE IF EXISTS public.user_niches CASCADE;
DROP TABLE IF EXISTS public.tasks CASCADE;
DROP TABLE IF EXISTS public.todos CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

----

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    plan TEXT DEFAULT 'free' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.workspaces (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    niche TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.teams (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('Chef d''équipe', 'Copywriter', 'Voix off', 'Monteur', 'Miniamaker')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(team_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.videos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    is_team_mode BOOLEAN DEFAULT false,
    team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
    idea_description TEXT,
    idea_notes TEXT,
    idea_validated BOOLEAN DEFAULT false,
    script_content TEXT,
    script_notes TEXT,
    script_validated BOOLEAN DEFAULT false,
    script_assignee_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    voiceover_type TEXT CHECK (voiceover_type IN ('IA', 'Humain')),
    voiceover_settings TEXT,
    voiceover_narrator TEXT,
    voiceover_links TEXT,
    voiceover_notes TEXT,
    voiceover_validated BOOLEAN DEFAULT false,
    voiceover_assignee_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    editing_notes TEXT,
    editing_resources JSONB DEFAULT '[]'::jsonb,
    editing_validated BOOLEAN DEFAULT false,
    editing_assignee_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    music_tracks JSONB DEFAULT '[]'::jsonb,
    music_notes TEXT,
    music_validated BOOLEAN DEFAULT false,
    music_assignee_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    thumbnail_images JSONB DEFAULT '[]'::jsonb,
    thumbnail_notes TEXT,
    thumbnail_validated BOOLEAN DEFAULT false,
    thumbnail_assignee_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    seo_title TEXT,
    seo_variants JSONB DEFAULT '[]'::jsonb,
    seo_description TEXT,
    seo_tags JSONB DEFAULT '[]'::jsonb,
    seo_notes TEXT,
    seo_validated BOOLEAN DEFAULT false,
    seo_assignee_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    upload_date TIMESTAMP WITH TIME ZONE,
    upload_status TEXT CHECK (upload_status IN ('Pas encore', 'Programmé', 'Publié')),
    upload_url TEXT,
    upload_notes TEXT,
    upload_validated BOOLEAN DEFAULT false,
    upload_assignee_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, full_name, avatar_url, created_at)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', ''),
    now()
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    full_name = COALESCE(EXCLUDED.full_name, public.users.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.users.avatar_url);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

INSERT INTO public.users (id, full_name, avatar_url, created_at)
SELECT 
  id, 
  COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', split_part(email, '@', 1)),
  COALESCE(raw_user_meta_data->>'avatar_url', raw_user_meta_data->>'picture', ''),
  now()
FROM auth.users
ON CONFLICT (id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.is_workspace_member(ws_id UUID, u_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.teams t
    JOIN public.team_members tm ON tm.team_id = t.id
    WHERE t.workspace_id = ws_id
    AND tm.user_id = u_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_team_member_or_owner(t_id UUID, u_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.teams t
    JOIN public.workspaces w ON w.id = t.workspace_id
    WHERE t.id = t_id AND w.user_id = u_id
  ) OR EXISTS (
    SELECT 1 FROM public.team_members tm
    WHERE tm.team_id = t_id AND tm.user_id = u_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view all users" ON public.users;
CREATE POLICY "Users can view all users"
  ON public.users FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
CREATE POLICY "Users can insert their own profile"
  ON public.users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Workspaces select policy" ON public.workspaces;
CREATE POLICY "Workspaces select policy"
  ON public.workspaces FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_workspace_member(id, auth.uid()));

DROP POLICY IF EXISTS "Workspaces insert policy" ON public.workspaces;
CREATE POLICY "Workspaces insert policy"
  ON public.workspaces FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Workspaces update policy" ON public.workspaces;
CREATE POLICY "Workspaces update policy"
  ON public.workspaces FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Workspaces delete policy" ON public.workspaces;
CREATE POLICY "Workspaces delete policy"
  ON public.workspaces FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Teams select policy" ON public.teams;
CREATE POLICY "Teams select policy"
  ON public.teams FOR SELECT
  TO authenticated
  USING (public.is_team_member_or_owner(id, auth.uid()));

DROP POLICY IF EXISTS "Teams insert policy" ON public.teams;
CREATE POLICY "Teams insert policy"
  ON public.teams FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.workspaces WHERE id = workspace_id AND user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Teams update policy" ON public.teams;
CREATE POLICY "Teams update policy"
  ON public.teams FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.workspaces WHERE id = workspace_id AND user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Teams delete policy" ON public.teams;
CREATE POLICY "Teams delete policy"
  ON public.teams FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.workspaces WHERE id = workspace_id AND user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Team members select policy" ON public.team_members;
CREATE POLICY "Team members select policy"
  ON public.team_members FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_team_member_or_owner(team_id, auth.uid()));

DROP POLICY IF EXISTS "Team members insert policy" ON public.team_members;
CREATE POLICY "Team members insert policy"
  ON public.team_members FOR INSERT
  TO authenticated
  WITH CHECK (public.is_team_member_or_owner(team_id, auth.uid()) OR user_id = auth.uid());

DROP POLICY IF EXISTS "Team members update policy" ON public.team_members;
CREATE POLICY "Team members update policy"
  ON public.team_members FOR UPDATE
  TO authenticated
  USING (public.is_team_member_or_owner(team_id, auth.uid()));

DROP POLICY IF EXISTS "Team members delete policy" ON public.team_members;
CREATE POLICY "Team members delete policy"
  ON public.team_members FOR DELETE
  TO authenticated
  USING (public.is_team_member_or_owner(team_id, auth.uid()));

DROP POLICY IF EXISTS "Videos select policy" ON public.videos;
CREATE POLICY "Videos select policy"
  ON public.videos FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.workspaces w WHERE w.id = workspace_id AND (w.user_id = auth.uid() OR public.is_workspace_member(w.id, auth.uid())))
  );

DROP POLICY IF EXISTS "Videos insert policy" ON public.videos;
CREATE POLICY "Videos insert policy"
  ON public.videos FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.workspaces w WHERE w.id = workspace_id AND (w.user_id = auth.uid() OR public.is_workspace_member(w.id, auth.uid())))
  );

DROP POLICY IF EXISTS "Videos update policy" ON public.videos;
CREATE POLICY "Videos update policy"
  ON public.videos FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.workspaces w WHERE w.id = workspace_id AND (w.user_id = auth.uid() OR public.is_workspace_member(w.id, auth.uid())))
  );

DROP POLICY IF EXISTS "Videos delete policy" ON public.videos;
CREATE POLICY "Videos delete policy"
  ON public.videos FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.workspaces w WHERE w.id = workspace_id AND w.user_id = auth.uid())
  );

----
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free' NOT NULL;
