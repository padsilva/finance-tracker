# 💰 Finance Tracker

A modern web application for tracking personal finances built with Next.js and Supabase.

## ✨ Features

- Personal finance tracking
- User authentication with Supabase
- Dark mode support
- Modern and responsive UI
- Form validation with Zod
- Cloudflare Turnstile protection

## 🚀 Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn package manager
- Supabase account
- Cloudflare Turnstile account

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key
TURNSTILE_SECRET_KEY=your_turnstile_secret_key
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/padsilva/finance-tracker.git
```

2. Navigate to the project directory:
```bash
cd finance-tracker
```

3. Install dependencies:
```bash
npm install
# or
yarn
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## 🛠️ Commands

- `dev`: runs development server with Turbopack
- `build`: creates production build
- `start`: starts production server
- `lint`: runs ESLint
- `format`: formats code with Prettier
- `type-check`: runs TypeScript type checking
- `prepare`: sets up Husky git hooks

## 🧰 Technologies

- [Next.js](https://nextjs.org/) - React framework with App Router
- [Supabase](https://supabase.com/) - Backend as a Service
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable UI components
- [Zod](https://zod.dev/) - Schema validation
- [Zustand](https://zustand-demo.pmnd.rs/) - State management
- [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) - Bot protection

## 🧪 Development Tools

- [ESLint](https://eslint.org/) - Linting
- [Prettier](https://prettier.io/) - Code formatting
- [Husky](https://typicode.github.io/husky/) - Git hooks
- [Commitlint](https://commitlint.js.org/) - Commit message linting
- [lint-staged](https://github.com/okonet/lint-staged) - Pre-commit linting

## 👷 Author

[@padsilva](https://www.github.com/padsilva)

## 📬 Feedback

If you have any feedback, please reach out to me at pauloalexandreduartesilva@gmail.com
