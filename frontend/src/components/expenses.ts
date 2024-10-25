import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {UtilsCategoriesInfo} from "../../utils/utils-categories-info";
import {GetCategoriesRes, GetCategoriesType} from "../types/getCategories.type";

export class Expenses {
    constructor() {
        this.getExpenses().then();
    };

    private async getExpenses(): Promise<void> {
        try {
            const result: GetCategoriesRes[] | GetCategoriesType | null = await CustomHttp.request(config.host + '/categories/expense');
            if (!(result as GetCategoriesType) || (result as GetCategoriesType).error) {
                throw new Error((result as GetCategoriesType).message);
            }
            if ((result as GetCategoriesRes[])) {
                this.processExpenses((result as GetCategoriesRes[]));
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log(error.message);
            } else {
                console.log("An unexpected error occurred", error);
            }
            return;
        }
    };

    private processExpenses(expenses: GetCategoriesRes[] | null): void {
        const expensesViewGroup: HTMLElement | null = document.getElementById('expenses-view-group');
        if (expenses && expensesViewGroup && expenses.length > 0) {
            expenses.forEach((expense: GetCategoriesRes): void => {
                const expensesViewItem: HTMLDivElement = document.createElement('div');
                expensesViewItem.className = 'card-css card rounded-3 shadow-sm';
                expensesViewItem.setAttribute('id', 'expense-' + expense.id);
                expensesViewGroup.appendChild(expensesViewItem);

                const expensesViewCard: HTMLDivElement = document.createElement('div');
                expensesViewCard.className = 'card-body';
                expensesViewItem.appendChild(expensesViewCard);

                const expensesViewCardTitle: HTMLHeadingElement = document.createElement('h2');
                expensesViewCardTitle.className = 'card-title';
                expensesViewCardTitle.innerText = expense.title;
                expensesViewCard.appendChild(expensesViewCardTitle);

                const expensesViewCardEdit: HTMLAnchorElement = document.createElement('a');
                expensesViewCardEdit.setAttribute('href', 'javascript:void(0)');
                expensesViewCardEdit.className = 'card-button btn btn-primary';
                expensesViewCardEdit.innerText = 'Редактировать';
                expensesViewCard.appendChild(expensesViewCardEdit);

                const expensesViewCardDelete: HTMLAnchorElement = document.createElement('a');
                expensesViewCardDelete.setAttribute('href', 'javascript:void(0)');
                expensesViewCardDelete.className = 'card-button btn btn-danger';
                expensesViewCardDelete.innerText = 'Удалить';
                expensesViewCard.appendChild(expensesViewCardDelete);

                expensesViewCardEdit.addEventListener("click", (): void => {
                    UtilsCategoriesInfo.setCategoryId(expense.id);
                    location.href = '#/expenses-edit';
                });

                expensesViewCardDelete.addEventListener("click", (): void => {
                    const expensesPopup: HTMLElement | null = document.getElementById('expenses-popup');
                    if (expensesPopup) {
                        expensesPopup.style.display = 'flex';
                    }

                    const expensesPopupNo: HTMLElement | null = document.getElementById('expenses-popup-no');
                    const expensesPopupYes: HTMLElement | null = document.getElementById('expenses-popup-yes');
                    if (expensesPopupNo && expensesPopupYes) {
                        expensesPopupNo.addEventListener("click", (): void => {
                            // expensesPopup.style.display = 'none';
                            location.href = '#/expenses-view';
                        });
                        expensesPopupYes.addEventListener("click", async (): Promise<void> => {
                            // expensesPopup.style.display = 'none';
                            try {
                                const result: GetCategoriesType = await CustomHttp.request(config.host + '/categories/expense/' + expense.id, 'DELETE');
                                if (result) {
                                    if (result.error) {
                                        throw new Error(result.message);
                                    }
                                    window.location.href = '#/expenses-view';
                                }
                            } catch (error: unknown) {
                                if (error instanceof Error) {
                                    console.log(error.message);
                                } else {
                                    console.log("An unexpected error occurred", error);
                                }
                                return;
                            }
                        });
                    }
                });
            });
        }

        const expensesViewCreate: HTMLDivElement = document.createElement('div');
        expensesViewCreate.className = 'card-css card rounded-3 shadow-sm';
        if (expensesViewGroup) {
            expensesViewGroup.appendChild(expensesViewCreate);
        }

        const expensesViewCreateButton: HTMLAnchorElement = document.createElement('a');
        expensesViewCreateButton.setAttribute('href', '#/expenses-create');
        expensesViewCreateButton.className = 'card-body card-body-view align-content-center text-center w-100';
        expensesViewCreate.appendChild(expensesViewCreateButton);

        const expensesViewCreateIcon: HTMLElement = document.createElement('i');
        expensesViewCreateIcon.className = 'fa-solid fa-plus text-secondary';
        expensesViewCreateButton.appendChild(expensesViewCreateIcon);
    };

}