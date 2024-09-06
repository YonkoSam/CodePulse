<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description"
          content="CodePulse is a collaborative platform for developers to share code, collaborate in real-time, and connect with other programmers.">
    <meta name="keywords"
          content="CodePulse, coding, collaboration, real-time, developers, programming, code sharing, social coding">
    <meta name="author" content="Your Name or Company Name">

    <!-- Open Graph Metadata (for social media sharing) -->
    <meta property="og:title" content="CodePulse - Real-time Collaboration for Developers">
    <meta property="og:description"
          content="Join CodePulse to collaborate with other developers, share code, and participate in real-time coding sessions.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://www.codepulse.com">
    <meta property="og:image" content="https://www.codepulse.com/og-image.jpg">
    <!-- Replace with your actual image URL -->
    <meta property="og:site_name" content="CodePulse">

    <!-- Twitter Card Metadata -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="CodePulse - Real-time Collaboration for Developers">
    <meta name="twitter:description"
          content="Connect with developers worldwide on CodePulse. Share code, collaborate in real-time, and grow your coding skills.">
    <meta name="twitter:image" content="https://www.codepulse.com/twitter-image.jpg">
    <meta name="twitter:site" content="@CodePulseApp">

    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href='favicon.ico'>

    <!-- Additional Metadata (Optional) -->
    <meta name="theme-color" content="#581c87">
    <meta name="robots" content="index, follow">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,100..900;1,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap"
        rel="stylesheet">

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
    @inertiaHead
</head>
<body class="font-hanken antialiased">
@inertia
</body>
</html>
