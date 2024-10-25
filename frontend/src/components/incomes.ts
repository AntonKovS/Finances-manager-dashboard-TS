import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {UtilsCategoriesInfo} from "../../utils/utils-categories-info";
import {GetCategoriesRes, GetCategoriesType} from "../types/getCategories.type";

export class Incomes {
    constructor() {
        this.getIncomes().then();
    };

    private async getIncomes(): Promise<void> {
        try {
            const result: GetCategoriesRes[] | GetCategoriesType | null = await CustomHttp.request(config.host + '/categories/income');
            if (!(result as GetCategoriesType) || (result as GetCategoriesType).error) {
                throw new Error((result as GetCategoriesType).message);
            }
            if ((result as GetCategoriesRes[])) {
                this.processIncomes((result as GetCategoriesRes[]));
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

    private processIncomes(incomes: GetCategoriesRes[] | null): void {
        const incomesViewGroup: HTMLElement | null = document.getElementById('incomes-view-group');
        if (incomes && incomesViewGroup && incomes.length > 0) {
            incomes.forEach((income: GetCategoriesRes): void => {
                const incomesViewItem: HTMLDivElement = document.createElement('div');
                incomesViewItem.className = 'card-css card rounded-3 shadow-sm';
                incomesViewItem.setAttribute('id', 'income-' + income.id);
                incomesViewGroup.appendChild(incomesViewItem);

                const incomesViewCard: HTMLDivElement = document.createElement('div');
                incomesViewCard.className = 'card-body';
                incomesViewItem.appendChild(incomesViewCard);

                const incomesViewCardTitle: HTMLHeadingElement = document.createElement('h2');
                incomesViewCardTitle.className = 'card-title';
                incomesViewCardTitle.innerText = income.title;
                incomesViewCard.appendChild(incomesViewCardTitle);

                const incomesViewCardEdit: HTMLAnchorElement = document.createElement('a');
                incomesViewCardEdit.setAttribute('href', 'javascript:void(0)');
                incomesViewCardEdit.className = 'card-button btn btn-primary';
                incomesViewCardEdit.innerText = 'Редактировать';
                incomesViewCard.appendChild(incomesViewCardEdit);

                const incomesViewCardDelete: HTMLAnchorElement = document.createElement('a');
                incomesViewCardDelete.setAttribute('href', 'javascript:void(0)');
                incomesViewCardDelete.className = 'card-button btn btn-danger';
                incomesViewCardDelete.innerText = 'Удалить';
                incomesViewCard.appendChild(incomesViewCardDelete);

                incomesViewCardEdit.addEventListener("click", (): void => {
                    UtilsCategoriesInfo.setCategoryId(income.id);
                    location.href = '#/incomes-edit';
                });

                incomesViewCardDelete.addEventListener("click", (): void => {
                    const incomesPopup: HTMLElement | null = document.getElementById('incomes-popup');
                    if (incomesPopup) {
                        incomesPopup.style.display = 'flex';
                    }

                    const incomesPopupNo: HTMLElement | null = document.getElementById('incomes-popup-no');
                    const incomesPopupYes: HTMLElement | null = document.getElementById('incomes-popup-yes');
                    if (incomesPopupNo && incomesPopupYes) {
                        incomesPopupNo.addEventListener("click", (): void => {
                            // incomesPopup.style.display = 'none';
                            location.href = '#/incomes-view';
                        });
                        incomesPopupYes.addEventListener("click", async (): Promise<void> => {
                            // incomesPopup.style.display = 'none';
                            try {
                                const result: GetCategoriesType = await CustomHttp.request(config.host + '/categories/income/' + income.id, 'DELETE');
                                if (!result || result.error) {
                                    throw new Error(result.message);
                                }
                                window.location.href = '#/incomes-view';
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

        const incomesViewCreate: HTMLDivElement = document.createElement('div');
        incomesViewCreate.className = 'card-css card rounded-3 shadow-sm';
        if (incomesViewGroup) {
            incomesViewGroup.appendChild(incomesViewCreate);
        }

        const incomesViewCreateButton: HTMLAnchorElement = document.createElement('a');
        incomesViewCreateButton.setAttribute('href', '#/incomes-create');
        incomesViewCreateButton.className = 'card-body card-body-view align-content-center text-center w-100';
        incomesViewCreate.appendChild(incomesViewCreateButton);

        const incomesViewCreateIcon: HTMLElement = document.createElement('i');
        incomesViewCreateIcon.className = 'fa-solid fa-plus text-secondary';
        incomesViewCreateButton.appendChild(incomesViewCreateIcon);
    };

}