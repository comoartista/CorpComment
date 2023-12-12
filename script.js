// -- COUNTER COMPONENT --
const textareaEl = document.querySelector('.form__textarea')
const  counterEl = document.querySelector('.counter')

const inputHandler = () => {
const maxNrChars = 150
const nrCharsTyped = textareaEl.value.length;
counterEl.textContent = maxNrChars - nrCharsTyped;
};

textareaEl.addEventListener('input', inputHandler);

// -- SUBMIT COMPONENT --

const  formEl = document.querySelector('.form')

const submitHandler = (e) => {
    e.preventDefault();
    console.log('gg');
}
formEl.addEventListener('submit', submitHandler)