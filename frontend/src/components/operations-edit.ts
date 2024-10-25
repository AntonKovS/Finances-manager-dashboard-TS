import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {UtilsCategoriesInfo} from "../../utils/utils-categories-info";
import {GetOperationsType} from "../types/get-operations.type";

export class OperationsEdit {
    readonly operationEditType: HTMLInputElement | null;
    readonly operationEditCategory: HTMLInputElement | null;
    readonly operationEditAmount: HTMLInputElement | null;
    readonly operationEditDate: HTMLInputElement | null;
    readonly operationEditComment: HTMLInputElement | null;
    readonly operationEditRequestButton: HTMLElement | null;

    constructor() {
        this.operationEditType = document.getElementById('operation-edit-type') as HTMLInputElement;
        this.operationEditCategory = document.getElementById('operation-edit-category') as HTMLInputElement;
        this.operationEditAmount = document.getElementById('operation-edit-amount') as HTMLInputElement;
        this.operationEditDate = document.getElementById('operation-edit-date') as HTMLInputElement;
        this.operationEditComment = document.getElementById('operation-edit-comment') as HTMLInputElement;
        this.operationEditRequestButton = document.getElementById('operation-edit-request-button');

        this.getOperationViaId().then();
    }

    private async getOperationViaId(): Promise<void> {
        try {
            const categoryId: number | null = UtilsCategoriesInfo.getCategoryId();
            if (!categoryId) {
                location.href = '#/incomes&expenses-view';
                return;
            }
            const resultCatId: GetOperationsType = await CustomHttp.request(config.host + '/operations/' + categoryId);
            if (resultCatId) {
                if (!resultCatId || resultCatId.error) {
                    throw new Error(resultCatId.message);
                }
                if (resultCatId.id === categoryId) {

                    if (this.operationEditType && this.operationEditCategory && this.operationEditAmount && this.operationEditDate && this.operationEditComment) {
                        this.operationEditType.value = resultCatId.type;
                        this.operationEditAmount.value = String(resultCatId.amount);
                        this.operationEditDate.value = resultCatId.date;
                        this.operationEditComment.value = resultCatId.comment;

                        UtilsCategoriesInfo.createSelectCategories(this.operationEditType, this.operationEditCategory, resultCatId.category).then();
                        UtilsCategoriesInfo.inputsListeners(this.operationEditType, this.operationEditCategory, this.operationEditAmount, this.operationEditDate);

                        if (this.operationEditRequestButton) {
                            this.operationEditRequestButton.addEventListener("click", (): void => {
                                CustomHttp.createUpdateRequest(config.host + '/operations/' + resultCatId.id, 'PUT', this.operationEditType, this.operationEditCategory, this.operationEditAmount, this.operationEditDate, this.operationEditComment);
                            });
                        }
                        UtilsCategoriesInfo.removeCategoryId();
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
    };

}