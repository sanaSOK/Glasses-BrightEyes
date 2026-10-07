<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
    <div class="max-w-md space-y-4">
      <div class="w-16 h-16 bg-sky-100 text-sky-600 rounded-3xl flex items-center justify-center mx-auto text-2xl font-extrabold">
        404
      </div>
      <h1 class="text-2xl font-extrabold text-slate-900">Page Not Found</h1>
      <p class="text-xs text-slate-500">The requested route does not exist or you do not have permission to access it.</p>
      <router-link to="/" class="inline-block px-5 py-2.5 bg-sky-600 text-white rounded-xl text-xs font-bold shadow-md">
        Return to Portal Dashboard
      </router-link>
    </div>
  </div>
</template>
