# YCS - YouTube Creator Studio

> Plateforme de gestion et de production de vidéos YouTube (faceless & créateurs de contenu) avec pipeline Kanban, gestion d'équipe et intégration Cloudinary / Supabase.

---

## 🚀 Fonctionnalités

- 🎯 **Pipeline Kanban 8 étapes** : Idée ➔ Script ➔ Voix Off ➔ Montage ➔ Musique ➔ Miniature ➔ SEO ➔ Upload.
- 👥 **Multi-Workspaces & Équipes** : Gestion de plusieurs chaînes YouTube avec attribution de rôles (Chef d'équipe, Copywriter, Voix off, Monteur, Miniamaker).
- ☁️ **Upload Cloudinary** : Téléversement direct des ressources de montage et des propositions de miniatures.
- ⚡ **Authentification Supabase** : Inscription Email/Mot de passe, Google OAuth et sécurité Row Level Security (RLS).
- 🎨 **Interface Moderne** : Développée avec Next.js 16, Tailwind CSS 4 et Lucide Icons.

---

## 🛠️ Stack Technique

- **Framework** : [Next.js 16 (App Router)](https://nextjs.org/)
- **Langage** : TypeScript
- **Base de données & Auth** : [Supabase](https://supabase.com/)
- **Stockage Médias** : [Cloudinary](https://cloudinary.com/)
- **Styling** : Tailwind CSS v4 + Radix / Base UI
- **Animations & Icônes** : Framer Motion, Lucide React

---

## 📦 Installation & Démarrage

### 1. Cloner le projet
```bash
git clone https://github.com/NdarawFall/YCS.git
cd YCS
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Variables d'environnement
Créez un fichier `.env.local` à la racine en copiant `.env.local.example` :
```env
NEXT_PUBLIC_SUPABASE_URL=votre_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_supabase_anon_key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=votre_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=votre_upload_preset
```

### 4. Configuration de la base de données
Exécutez le script SQL présent dans `supabase-setup.sql` directement dans l'éditeur SQL de votre projet Supabase.

### 5. Lancer l'application
```bash
npm run dev
```
Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.
