import { createRouter, createWebHashHistory } from 'vue-router'

const routes = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'Main',
      component: () => import('@/page/auth/index.vue')
    },
    {
      path: '/dev',
      name: 'dev',
      component: () => import('@/page/auth/dev.vue')
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('@/page/auth/index.vue'),
      children: [
        {
          path: 'signIn',
          name: 'signIn',
          component: () => import('@/page/auth/signIn.vue')
        },
        {
          path: 'signUp',
          name: 'signUp',
          component: () => import('@/page/auth/signUp.vue')
        },
        {
          path: 'code',
          name: 'code',
          component: () => import('@/page/auth/code.vue')
        },
        {
          path: 'password',
          name: 'authpassword',
          component: () => import('@/page/auth/password.vue')
        },
        {
          path: 'settings',
          name: 'authset',
          component: () => import('@/page/auth/settings/index.vue'),
          redirect: '/auth/settings/general',
          children: [
            {
              path: 'proxy',
              name: 'authproxy',
              component: () => import('@/page/auth/settings/proxy.vue')
            },
            {
              path: 'language',
              name: 'authlanguage',
              component: () => import('@/page/auth/settings/language.vue')
            },
            {
              path: 'general',
              name: 'authgeneral',
              component: () => import('@/page/auth/settings/general.vue')
            }
          ]
        }
      ]
    },
    {
      path: '/home',
      name: 'Home',
      component: () => import('@/page/home/index.vue'),
      children: [
        {
          path: 'chats',
          name: 'chats',
          component: () => import('@/page/home/chats/chastsList.vue')
        },
        {
          path: 'Contacts',
          name: 'Contacts',
          component: () => import('@/page/home/chats/contacts.vue')
        },
        {
          path: 'archives',
          name: 'archives',
          component: () => import('@/page/home/chats/archives.vue')
        },
        {
          path: 'setting',
          name: 'setting',
          component: () => import('@/page/setting/index.vue')
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/home'
    }
  ]
})

export default routes
