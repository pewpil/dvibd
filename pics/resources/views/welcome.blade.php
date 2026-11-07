<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        @include('partials.head')
    </head>
    <body class="min-h-screen bg-white text-zinc-950 antialiased dark:bg-zinc-950 dark:text-zinc-50">
        <main class="flex min-h-screen items-center justify-center px-6">
            <div class="max-w-xl text-center">
                <h1 class="text-6xl font-semibold tracking-tight sm:text-7xl">Pics</h1>
                <p class="mt-4 text-balance text-base leading-relaxed text-zinc-600 sm:text-lg dark:text-zinc-400">
                    Store, organize, and browse your pictures, photos, and images.
                </p>
            </div>
        </main>
    </body>
</html>
