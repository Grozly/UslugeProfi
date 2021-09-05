export default class InputValidator {
    private inputName: string;
    private inputElement: HTMLInputElement;
    private resultErrorMessages: Array<string> = [];

    constructor(inputElement: HTMLInputElement, inputName: string = "") {
        this.inputElement = inputElement;
        this.inputName = inputName;
        return this;
    }

    isNotEmpty(errorMessage: string = `Поле ${this.inputName} не может быть пустым!`) {
        if (this.inputElement.value.trim().length === 0) this.resultErrorMessages.push(errorMessage);
        return this;
    }

    minLength(
        minLength: number,
        errorMessage: string = `Поле ${this.inputName} не может быть менее ${minLength} символов!`
    ) {
        if (this.inputElement.value.trim().length < minLength) this.resultErrorMessages.push(errorMessage);
        return this;
    }

    maxLength(
        maxLength: number,
        errorMessage: string = `Поле ${this.inputName} не может быть более ${maxLength} символов!`
    ) {
        if (this.inputElement.value.trim().length > maxLength) this.resultErrorMessages.push(errorMessage);
        return this;
    }

    isEmail(errorMessage: string = `Поле ${this.inputName} не корректно! Пример: test@test.com`) {
        const emailRegExp =
            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

        if (!emailRegExp.test(this.inputElement.value.trim())) this.resultErrorMessages.push(errorMessage);
        return this;
    }

    isEqual(otherInputElement: HTMLInputElement, errorMessage: string = `Поле ${this.inputName} не совпадает!`) {
        if (this.inputElement.value.trim() !== otherInputElement.value.trim())
            this.resultErrorMessages.push(errorMessage);
        return this;
    }

    isChecked(errorMessage: string = `Поле ${this.inputName} не выбрано!`) {
        if (this.inputElement.checked !== true) this.resultErrorMessages.push(errorMessage);
        return this;
    }

    getErrors() {
        return this.resultErrorMessages;
    }
}
