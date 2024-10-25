import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {UtilsCategoriesInfo} from "../../utils/utils-categories-info";

export class OperationsCreate {
    readonly createSelectType: HTMLInputElement | null;
    readonly createSelectCategory: HTMLInputElement | null;
    readonly createAmount: HTMLInputElement | null;
    readonly createDate: HTMLInputElement | null;
    readonly createComment: HTMLInputElement | null;
    readonly createRequestButton: HTMLElement | null;
    readonly createSelect: string | null;

    constructor() {
        this.createSelectType = document.getElementById('create-select-type') as HTMLInputElement;
        this.createSelectCategory = document.getElementById('create-select-category') as HTMLInputElement;
        this.createAmount = document.getElementById('create-amount') as HTMLInputElement;
        this.createDate = document.getElementById('create-date') as HTMLInputElement;
        this.createComment = document.getElementById('create-comment') as HTMLInputElement;
        this.createRequestButton = document.getElementById('create-request-button');

        this.createSelect = UtilsCategoriesInfo.getCategoryType();
        if (this.createSelect) {
            this.createSelectType.value = this.createSelect;
        }

        UtilsCategoriesInfo.createSelectCategories(this.createSelectType, this.createSelectCategory).then();
        UtilsCategoriesInfo.inputsListeners(this.createSelectType, this.createSelectCategory, this.createAmount, this.createDate);

        if (this.createRequestButton) {
            this.createRequestButton.addEventListener("click", (): void => {
                CustomHttp.createUpdateRequest(config.host + '/operations', 'POST', this.createSelectType, this.createSelectCategory, this.createAmount, this.createDate, this.createComment);
            });
        }

        UtilsCategoriesInfo.removeCategoryType();
    };
}