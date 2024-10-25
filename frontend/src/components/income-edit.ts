import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {UtilsCategoriesInfo} from "../../utils/utils-categories-info";
import {GetCategoriesType} from "../types/getCategories.type";

export class IncomeEdit {
    constructor() {
        this.getIncomeViaId().then();
    }

    private async getIncomeViaId(): Promise<void> {
        try {
            const categoryId: number | null = UtilsCategoriesInfo.getCategoryId();
            const getResult: GetCategoriesType = await CustomHttp.request(config.host + '/categories/income/' + categoryId);
            if (!getResult || getResult.error) {
                throw new Error(getResult.message);
            }
            if (getResult.id && getResult.title && getResult.id === categoryId) {
                const incomeEditInput: HTMLInputElement | HTMLElement | null = document.getElementById('income-edit-input');
                (incomeEditInput as HTMLInputElement).value = getResult.title;

                const incomeUpdate: HTMLElement | null = document.getElementById('income-update');
                if (incomeUpdate) {
                    incomeUpdate.addEventListener("click", async (): Promise<void> => {
                        const updateResult: GetCategoriesType = await CustomHttp.request(config.host + '/categories/income/' + categoryId, 'PUT', {
                            "title": (incomeEditInput as HTMLInputElement).value
                        });
                        if (!updateResult || updateResult.error) {
                            throw new Error(updateResult.message);
                        }
                        UtilsCategoriesInfo.removeCategoryId();
                        location.href = '#/incomes-view';
                    });
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
    };

}