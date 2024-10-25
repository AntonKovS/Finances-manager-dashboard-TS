import {Layout} from "./components/layout";
import {Login} from "./components/login";
import {Auth} from "./services/auth";
import {Incomes} from "./components/incomes";
import {Expenses} from "./components/expenses";
import {IncomesCreate} from "./components/incomes-create";
import {ExpensesCreate} from "./components/expenses-create";
import {IncomeEdit} from "./components/income-edit";
import {ExpensesEdit} from "./components/expenses-edit";
import {OperationsView} from "./components/operations-view";
import {OperationsCreate} from "./components/operations-create";
import {OperationsEdit} from "./components/operations-edit";
import {Dashboard} from "./components/dashboard";
import {RouteType} from "./types/route.type";
import {UserInfoLoginType} from "./types/user-info-login.type";

export class Router {
    readonly contentElement: HTMLElement | null;
    readonly titleElement: HTMLElement | null;
    readonly styleElement: HTMLElement | null;
    private routes: RouteType[];

    constructor() {
        this.contentElement = document.getElementById('content');
        this.titleElement = document.getElementById('page-title');
        this.styleElement = document.getElementById('style-element');

        this.routes = [
            {
                route: '#/',
                title: 'Главная',
                template: 'templates/pages/dashboard.html',
                useLayout: 'templates/layout.html',
                styles: 'dashboard.css',
                load: () => {
                    new Dashboard();
                },
            },
            {
                route: '#/signup',
                title: 'Создайте аккаунт',
                template: 'templates/pages/auth/signup.html',
                useLayout: false,
                styles: 'auth.css',
                load: () => {
                    new Login('signup');
                },
            },
            {
                route: '#/login',
                title: 'Вход',
                template: 'templates/pages/auth/login.html',
                useLayout: false,
                styles: 'auth.css',
                load: () => {
                    new Login('login');
                },
            },
            {
                route: '#/incomes&expenses-view',
                title: 'Доходы и расходы',
                template: 'templates/pages/incomes-expenses/incomes&expenses-view.html',
                useLayout: 'templates/layout.html',
                styles: 'incomes-expenses.css',
                load: () => {
                    new OperationsView();
                },
            },
            {
                route: '#/incomes&expenses-create',
                title: 'Создание дохода/расхода',
                template: 'templates/pages/incomes-expenses/incomes&expenses-create.html',
                useLayout: 'templates/layout.html',
                styles: 'incomes-expenses.css',
                load: () => {
                    new OperationsCreate();
                },
            },
            {
                route: '#/incomes&expenses-edit',
                title: 'Редактирование дохода/расхода',
                template: 'templates/pages/incomes-expenses/incomes&expenses-edit.html',
                useLayout: 'templates/layout.html',
                styles: 'incomes-expenses.css',
                load: () => {
                    new OperationsEdit();
                },
            },
            {
                route: '#/incomes-view',
                title: 'Доходы',
                template: 'templates/pages/incomes-expenses/incomes-view.html',
                useLayout: 'templates/layout.html',
                styles: 'incomes-expenses.css',
                load: () => {
                    new Incomes();
                },
            },
            {
                route: '#/incomes-create',
                title: 'Создание категории доходов',
                template: 'templates/pages/incomes-expenses/incomes-create.html',
                useLayout: 'templates/layout.html',
                styles: 'incomes-expenses.css',
                load: () => {
                    new IncomesCreate();
                },
            },
            {
                route: '#/incomes-edit',
                title: 'Редактирование категории доходов',
                template: 'templates/pages/incomes-expenses/incomes-edit.html',
                useLayout: 'templates/layout.html',
                styles: 'incomes-expenses.css',
                load: () => {
                    new IncomeEdit();
                },
            },
            {
                route: '#/expenses-view',
                title: 'Расходы',
                template: 'templates/pages/incomes-expenses/expenses-view.html',
                useLayout: 'templates/layout.html',
                styles: 'incomes-expenses.css',
                load: () => {
                    new Expenses();
                },
            },
            {
                route: '#/expenses-create',
                title: 'Создание категории расходов',
                template: 'templates/pages/incomes-expenses/expenses-create.html',
                useLayout: 'templates/layout.html',
                styles: 'incomes-expenses.css',
                load: () => {
                    new ExpensesCreate();
                },
            },
            {
                route: '#/expenses-edit',
                title: 'Редактирование категории расходов',
                template: 'templates/pages/incomes-expenses/expenses-edit.html',
                useLayout: 'templates/layout.html',
                styles: 'incomes-expenses.css',
                load: () => {
                    new ExpensesEdit();
                },
            }];

        this.initEvents();
    }

    private initEvents(): void {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
    }

    private async activateRoute(): Promise<void> {
        const urlRoute: string = window.location.hash.split('?')[0];
        const newRoute: RouteType | undefined = this.routes.find(item => item.route === urlRoute);

        if (urlRoute === '#/logout') {
            const result: boolean = await Auth.logout();
            if (result) {
                window.location.href = '#/login';
                return;
            } else  {
                //....(вывести ошибку, что не удалось разлогиниться)
                window.location.href = '#/login';
                return;
            }
        }

        const accessToken: string | null = localStorage.getItem(Auth.accessTokenKey);
        const userInfo: UserInfoLoginType | null = Auth.getUserInfo();
        if ((!userInfo || !accessToken) && urlRoute !== '#/signup') {
            await Auth.removeTokensAndUserInfo();
            if (urlRoute !== '#/login') {
                window.location.href = '#/login';
                return;
            }
        }

        if (newRoute) {
            if (newRoute.template) {
                let contentBlock: HTMLElement | null = this.contentElement;
                if (newRoute.useLayout && this.contentElement) {
                    this.contentElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                    contentBlock = document.getElementById('content-layout');
                }
                if (contentBlock) {
                    contentBlock.innerHTML = await fetch(newRoute.template).then(response => response.text());
                }
                if (newRoute.title && this.titleElement) {
                    this.titleElement.innerText = newRoute.title + ' | SaveMoney';
                }
                const profileName: HTMLElement | null = document.getElementById('profile-name');
                if (userInfo && userInfo.fullName && profileName) {
                    profileName.innerText = userInfo.fullName;
                }
            }
            if (this.styleElement) {
                this.styleElement.setAttribute('href', ('css/' + newRoute.styles));
            }
            if (newRoute.useLayout) {
                new Layout(newRoute);
            }
            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }
        } else {
            window.location.href = '#/';
            return;
        }
    }
}