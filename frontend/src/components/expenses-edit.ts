import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {UtilsCategoriesInfo} from "../../utils/utils-categories-info";
import {GetCategoriesType} from "../types/getCategories.type";

export class ExpensesEdit {
    constructor() {
        this.getExpenseViaId().then();
    }

    private async getExpenseViaId(): Promise<void> {
        try {
            const categoryId: number | null = UtilsCategoriesInfo.getCategoryId();
            if (categoryId) {
                const getResult: GetCategoriesType = await CustomHttp.request(config.host + '/categories/expense/' + categoryId);
                if (!getResult || getResult.error) {
                    throw new Error(getResult.message);
                }
                if (getResult.id && getResult.title && getResult.id === categoryId) {
                    const expenseEditInput: HTMLInputElement | HTMLElement | null = document.getElementById('expense-edit-input');
                    if (expenseEditInput) {
                        (expenseEditInput as HTMLInputElement).value = getResult.title;
                    }

                    const expenseUpdate: HTMLElement | null = document.getElementById('expense-update');
                    if (expenseUpdate) {
                        expenseUpdate.addEventListener("click", async (): Promise<void> => {
                            const updateResult: GetCategoriesType = await CustomHttp.request(config.host + '/categories/expense/' + categoryId, 'PUT', {
                                "title": (expenseEditInput as HTMLInputElement).value
                            });
                            if (!updateResult || updateResult.error) {
                                throw new Error(updateResult.message);
                            }
                            UtilsCategoriesInfo.removeCategoryId();
                            location.href = '#/expenses-view';
                        });
                    }
                }
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