import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {RouteType} from "../types/route.type";
import {GetBalanceType} from "../types/get-balance.type";

export class Layout {
    private route: RouteType;
    readonly labelForChange: HTMLElement | null;
    readonly balance: HTMLElement | null;
    readonly balanceAmount: HTMLInputElement | null;
    readonly balanceUpdateButton: HTMLElement | null;

    constructor(newRoute: RouteType) {
        this.route = newRoute;
        this.labelForChange = document.getElementById('lable-for-change');
        this.balance = document.getElementById('balance');
        this.balanceAmount = document.getElementById('balance-amount') as HTMLInputElement;
        this.balanceUpdateButton = document.getElementById('balance-update-button');

        this.showSideBar();
        this.activateSideBar();
        this.showBalance().then();

        if (this.balance && this.balanceUpdateButton && this.balance.parentElement) {
            this.balance.parentElement.addEventListener("click", this.balanceMenu.bind(this));
            this.balanceUpdateButton.addEventListener("click", this.updateBalance.bind(this));
        }
    }

    private showSideBar(): void {
        let ready = (callback: any): void => {
            if (document.readyState !== "loading") callback();
            else document.addEventListener("DOMContentLoaded", callback);
        }

        ready((): void => {
            const sidebarButton: HTMLElement | null = document.querySelector('.sidebar-button');
            const sidebarMain: HTMLElement | null = document.querySelector(".sidebar-main");
            const sidebarCss: HTMLElement | null = document.querySelector(".sidebar-css");
            function toggleSidebar(): void {
                if (sidebarButton && sidebarMain && sidebarCss) {
                    sidebarButton.classList.toggle("active");
                    sidebarMain.classList.toggle("move-to-left-bar");
                    sidebarCss.classList.toggle("move-to-left-sidebar");
                }
            }
            if (sidebarButton) {
                sidebarButton.addEventListener("click", toggleSidebar);
            }
            document.addEventListener("keyup", (e: KeyboardEvent): void => {
                if (e.keyCode === 27) {
                    toggleSidebar();
                }
            });
        });
    };

    // activateSideBar() {
    //     const that = this;
    //
    //     function toggleSidebar(e) {
    //         $("#leftside-navigation ul ul").slideUp();
    //         $(this).next().is(":visible") || $(this).next().slideDown();
    //         $("i.nav-link-item-icon").toggleClass("fa-chevron-right fa-chevron-down");
    //         e.stopPropagation();
    //     }
    //
    //     document.querySelector("#leftside-navigation .sub-menu > a").addEventListener("click", toggleSidebar);
    //
    //     document.querySelectorAll('.sidebar-css .nav-link').forEach(item => {
    //         const href = item.getAttribute('href');
    //         if ((this.route.route.includes(href) && href !== '#/') || (this.route.route === '#/' && href === '#/')) {
    //             item.classList.add('active');
    //             item.classList.remove('link-body-emphasis');
    //             if (item.classList.contains('sub-menu-hidden-element')) {
    //                 this.labelForChange.firstElementChild.innerText = item.firstElementChild.textContent;
    //                 this.labelForChange.classList.add('active');
    //                 this.labelForChange.classList.remove('link-body-emphasis');
    //             }
    //         }
    //         if (this.route.route === '#/incomes-create' || this.route.route === '#/expenses-create') {
    //             this.labelForChange.firstElementChild.innerText = 'Создание';
    //             this.labelForChange.classList.add('active');
    //             this.labelForChange.classList.remove('link-body-emphasis');
    //         }
    //         if (this.route.route === '#/incomes-edit' || this.route.route === '#/expenses-edit') {
    //             this.labelForChange.firstElementChild.innerText = 'Редактирование';
    //             this.labelForChange.classList.add('active');
    //             this.labelForChange.classList.remove('link-body-emphasis');
    //         }
    //     });
    // };

    private activateSideBar(): void {
        // const that = this;

        const toggleSidebar = (e: Event): void => {
            const subMenus: NodeListOf<HTMLElement> | null = document.querySelectorAll("#leftside-navigation ul ul");
            if (subMenus) {
                subMenus.forEach((menu: HTMLElement): void => {
                    menu.style.display = 'none';
                });
            }
            const that: EventTarget | null = e.target;
            
            if (that as HTMLElement) {
                const nextElement: Element | null = (that as HTMLElement).nextElementSibling;
                if (nextElement && (nextElement as HTMLElement).style.display !== 'block') {
                    // nextElement.style.display = 'block';
                    nextElement.classList.toggle("d-block");
                    nextElement.classList.toggle("d-none");
                }
            }

            // const nextElement: Element | null = (e.target as HTMLElement).nextElementSibling;
            // if (nextElement && nextElement instanceof HTMLElement && nextElement.style.display !== 'block') {
            //     // nextElement.style.display = 'block';
            //     nextElement.classList.toggle("d-block");
            //     nextElement.classList.toggle("d-none");
            // }

            const navIcons: NodeListOf<HTMLElement> | null = document.querySelectorAll("i.nav-link-item-icon");
            if (navIcons) {
                navIcons.forEach((icon: HTMLElement): void => {
                    icon.classList.toggle("fa-chevron-right");
                    icon.classList.toggle("fa-chevron-down");
                });
            }

            e.stopPropagation();
        }

        const subMenuLinks: NodeListOf<HTMLElement> | null = document.querySelectorAll("#leftside-navigation .sub-menu > a");
        if (subMenuLinks) {
            subMenuLinks.forEach((link: HTMLElement): void => {
                link.addEventListener("click", toggleSidebar);
            });
        }

        const sideBarElements: NodeListOf<Element> = document.querySelectorAll('.sidebar-css .nav-link');
        if (sideBarElements && sideBarElements.length > 0) {
            sideBarElements.forEach((item: Element): void => {
                const href: string | null = item.getAttribute('href');
                if (this.labelForChange) {
                    const labelForChangeFirstChild: Element | HTMLElement | null = this.labelForChange.firstElementChild;
                    if (labelForChangeFirstChild && href) {
                        if ((this.route.route.includes(href) && href !== '#/') || (this.route.route === '#/' && href === '#/')) {
                            item.classList.add('active');
                            item.classList.remove('link-body-emphasis');
                            if (item.classList.contains('sub-menu-hidden-element') && item.firstElementChild && item.firstElementChild.textContent) {
                                (labelForChangeFirstChild as HTMLElement).innerText = item.firstElementChild.textContent;
                                this.labelForChange.classList.add('active');
                                this.labelForChange.classList.remove('link-body-emphasis');
                            }
                        }
                        if (this.route.route === '#/incomes-create' || this.route.route === '#/expenses-create') {
                            (labelForChangeFirstChild as HTMLElement).innerText = 'Создание';
                            this.labelForChange.classList.add('active');
                            this.labelForChange.classList.remove('link-body-emphasis');
                        }
                        if (this.route.route === '#/incomes-edit' || this.route.route === '#/expenses-edit') {
                            (labelForChangeFirstChild as HTMLElement).innerText = 'Редактирование';
                            this.labelForChange.classList.add('active');
                            this.labelForChange.classList.remove('link-body-emphasis');
                        }
                    }
                }
            });
        }
    };

    private async showBalance(): Promise<void> {
        try {
            const result: GetBalanceType = await CustomHttp.request(config.host + '/balance');
            if (!result || result.error) {
                throw new Error(result.message);
            }
            if (this.balance) {
                this.balance.innerText = result.balance + " $";
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log(error.message);
            } else {
                console.log("An unexpected error occurred", error);
            }
            return;
        }
    }

    private async balanceMenu(): Promise<void> {
        try {
            const result: GetBalanceType = await CustomHttp.request(config.host + '/balance');
            if (!result || result.error) {
                throw new Error(result.message);
            }
            if (this.balance && this.balanceAmount) {
                this.balance.innerText = result.balance + " $";
                this.balanceAmount.value = String(result.balance);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log(error.message);
            } else {
                console.log("An unexpected error occurred", error);
            }
            return;
        }
    }

    private async updateBalance(): Promise<void> {
        try {
            if (this.balance && this.balanceAmount && this.balance.textContent) {
                if (this.balanceAmount.value === this.balance.textContent.split(' ')[0] || !this.balanceAmount.value.match(/^(\d){1,13}$/g)) {
                    return;
                }
                const result = await CustomHttp.request(config.host + '/balance', 'PUT', {"newBalance": this.balanceAmount.value});
                if (!result || result.error) {
                    throw new Error(result.message);
                }
                await this.showBalance();
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log(error.message);
            } else {
                console.log("An unexpected error occurred", error);
            }
            return;
        }
    }

}