import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/', name: 'home', component: HomeView
    },
    {
        path: '/change-password', name: 'changePasswordView', component: () => import('../views/ChangePasswordView.vue')
    },
    {
        path: '/change-alternate-email',
        name: 'changeAlternateEmailView',
        component: () => import('../views/ChangeAlternateEmailView.vue')
    },
    {
        path: '/remember-email', name: 'RememberEmailView', component: () => import('../views/RememberEmailView.vue')
    }
    ,
    {
        path: '/recover-password', name: 'recoverPassword', component: () => import('../views/RecoverPasswordView.vue')
    }

    ,
    {
        path: '/recover-alternate-mail', name: 'recoverAlternateEmailView', component: () => import('../views/recoverAlternateEmailView.vue')
    }
]

const router = new VueRouter({
    mode: 'history', base: process.env.BASE_URL, routes
})

export default router
