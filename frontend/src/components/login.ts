import {Auth} from "../services/auth";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {LoginFormFieldsType} from "../types/login-form-fields.type";
import {SignupFormFieldsType} from "../types/signup-form-fields.type";

export class Login {
    readonly page: string;
    readonly processElement: HTMLElement | null;
    private validForm: HTMLElement | boolean;
    private rememberMe: HTMLInputElement | boolean;
    private fields: LoginFormFieldsType[] = [];
    private email: string | null;
    private password: string | null;
    private repeatPassword: string | null;
    private name: string | null;
    private lastName: string | null;

    constructor(page: string) {
        this.page = page;
        this.processElement = null;
        this.validForm = false;
        this.rememberMe = false;
        this.email = null;
        this.password = null;
        this.repeatPassword = null;
        this.name = null;
        this.lastName = null;

        const accessToken: string | null = localStorage.getItem(Auth.accessTokenKey);
        if (accessToken) {
            location.href = '#/';
            return;
        }

        this.fields = [
            {
                name: 'email',
                id: 'email',
                element: null,
                // regex: /./,
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                valid: false,
            },
            {
                name: 'password',
                id: 'password',
                element: null,
                // regex: /./,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false,
            },
        ];

        if (this.page === 'signup') {
            this.fields.unshift({
                name: 'fullName',
                id: 'fullName',
                element: null,
                // regex: /./,
                regex: /^[А-ЯЁ][а-яё]*\s[А-ЯЁ][а-яё]*\s[А-ЯЁ][а-яё]*$/,
                valid: false,
            });
            this.fields.push({
                name: 'repeatPassword',
                id: 'repeatPassword',
                element: null,
                regex: /./,
                valid: false,
            });
        }

        const that: Login = this;
        this.fields.forEach((item: LoginFormFieldsType): void => {
            item.element = document.getElementById(item.id) as HTMLInputElement;
            if (item.element) {
                item.element.onchange = function (): void {
                    that.validateField.call(that, item, (item.element as HTMLInputElement));
                }
            }
        });

        this.processElement = document.getElementById('process');
        if (this.processElement) {
            this.processElement.onclick = function (): void {
                that.processForm().then();
            }
        }
    }

    validateField(field: LoginFormFieldsType, element: HTMLInputElement): void {
        const password: LoginFormFieldsType | undefined = this.fields.find((item: LoginFormFieldsType): boolean => item.name === 'password');
        const repeatPassword: LoginFormFieldsType | undefined = this.fields.find((item: LoginFormFieldsType): boolean => item.name === 'repeatPassword');

        if (!element.value || !element.value.match(field.regex)) {
            element.classList.add("is-invalid");
            field.valid = false;
        } else {
            element.classList.remove("is-invalid");
            field.valid = true;
        }

        if (password && repeatPassword && element === repeatPassword.element) {
            if ((password.element as HTMLInputElement).value !== (repeatPassword.element as HTMLInputElement).value) {
                element.classList.add("is-invalid");
                field.valid = false;
            } else {
                element.classList.remove("is-invalid");
                field.valid = true;
            }
        }

        if (this.processElement) {
            this.validForm = this.fields.every((item: LoginFormFieldsType) => item.valid);
            if (this.validForm) {
                this.processElement.removeAttribute('disabled');
            } else {
                this.processElement.setAttribute('disabled', 'disabled');
            }
        }
    }

    private async processForm(): Promise<void> {
        if (this.validForm) {
            const emailEl: LoginFormFieldsType | undefined = this.fields.find((item: LoginFormFieldsType): boolean => item.name === 'email');
            if (emailEl) {
                this.email = (emailEl.element as HTMLInputElement).value;
            }
            const passwordEl: LoginFormFieldsType | undefined = this.fields.find((item: LoginFormFieldsType): boolean => item.name === 'password');
            if (passwordEl) {
                this.password = (passwordEl.element as HTMLInputElement).value;
            }

            if (this.page === 'signup') {
                const repeatPasswordEl: LoginFormFieldsType | undefined = this.fields.find((item: LoginFormFieldsType): boolean => item.name === 'repeatPassword');
                if (repeatPasswordEl) {
                    this.repeatPassword = (repeatPasswordEl.element as HTMLInputElement).value;
                }

                try {
                    const nameEl: LoginFormFieldsType | undefined = this.fields.find((item: LoginFormFieldsType): boolean => item.name === 'fullName');
                    const lastNameEl: LoginFormFieldsType | undefined = this.fields.find((item: LoginFormFieldsType): boolean => item.name === 'fullName');
                    if (nameEl && lastNameEl) {
                        this.name = (nameEl.element as HTMLInputElement).value.split(' ')[0];
                        this.lastName = (lastNameEl.element as HTMLInputElement).value.split(' ')[1];
                    }

                    const result: SignupFormFieldsType = await CustomHttp.request(config.host + '/signup', 'POST', {
                        name: this.name,
                        lastName: this.lastName,
                        email: this.email,
                        password: this.password,
                        passwordRepeat: this.repeatPassword,
                    });
                    if (result) {
                        if (result.error || !result.user) {
                            throw new Error(result.message);
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

            const rememberElement: HTMLInputElement | null = document.getElementById('remember-me') as HTMLInputElement;

            if (rememberElement) {
                this.rememberMe = rememberElement.checked;
                // Это тоже самое, что и выше
                // if (rememberElement.checked) {
                //     this.rememberMe = true;
                // } else {
                //     this.rememberMe = false;
                // }
            }

            try {
                const result = await CustomHttp.request(config.host + '/login', 'POST', {
                    email: this.email,
                    password: this.password,
                    rememberMe: this.rememberMe
                });
                if (result) {
                    if (result.error || !result.tokens.accessToken || !result.tokens.refreshToken || !result.user.name || !result.user.lastName || !result.user.id) {
                        throw new Error(result.message);
                    }
                    Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                    Auth.setUserInfo({
                        fullName: result.user.name + ' ' + result.user.lastName,
                        userId: result.user.id
                    })
                    location.href = '#/';
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

}