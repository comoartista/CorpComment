// -- GLOBAL --
const MAX_CHARS = 150;
const BASE_API_URL = 'https://bytegrad.com/course-assets/js/1/api';

const textareaEl = document.querySelector('.form__textarea');
const counterEl = document.querySelector('.counter');
const formEl = document.querySelector('.form');
const feedbacksListEl = document.querySelector('.feedbacks');
const spinnerEl = document.querySelector('.spinner');

const renderFeedbackItems = feedbackItem => {
    const feedbackItemHTML = `
        <li class="feedback">
            <button class="upvote">
                <i class="fa-solid fa-caret-up upvote__icon"></i>
                <span class="upvote__count">${feedbackItem.upvoteCount}</span>
            </button>
            <section class="feedback__badge">
                <p class="feedback__letter">${feedbackItem.badgeLetter}</p>
            </section> 
            <div class="feedback__content">
                <p class="feedback__company">${feedbackItem.company}</p>
                <p class="feedback__text">${feedbackItem.text}</p>
            </div>
            <p class="feedback__date">${feedbackItem.daysAgo === 0 ? 'NEW' : `${feedbackItem.daysAgo}d`}</p>
        </li>
    `;

    feedbacksListEl.insertAdjacentHTML('beforeend', feedbackItemHTML);
}




// -- COUNTER COMPONENT --
const inputHandler = () => {
const maxNrChars = MAX_CHARS;
const nrCharsTyped = textareaEl.value.length;
counterEl.textContent = maxNrChars - nrCharsTyped;
};

textareaEl.addEventListener('input', inputHandler);

// -- FORM COMPONENT --
const showVisualINdicator = (textCheck) => {
    const className = textCheck === 'valid' ? 'form--valid' : 'form--invalid'
    formEl.classList.add(className)
    setTimeout(() => formEl.classList.remove(className), 2000)
};

const submitHandler = (e) => {
    e.preventDefault();
    const text = textareaEl.value;
    if (text.includes('#') && text.length >= 5) {
        showVisualINdicator('valid');
    } else {
        showVisualINdicator('invalid');

        // focus textarea
        textareaEl.focus();

        return;
    }

    const hashtag = text.split(' ').find(word => word.includes('#'))
    const company = hashtag.substring(1).toUpperCase();
    const badgeLetter = company.substring(0, 1)
    const upvoteCount = 0;
    const daysAgo = 0;

    // render feedback item
    const feedbackItem = {
        upvoteCount,
        company,
        badgeLetter,
        daysAgo,
        text
    }
    renderFeedbackItems(feedbackItem);

    // send feedback item to server
    fetch(`${BASE_API_URL}/feedbacks`, {
        method: 'POST',
        body: JSON.stringify(feedbackItem),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(responce => {
        if(!responce.ok) {
            console.log('Wrong');
            return;
        } 

        console.log('sus');
    }).catch(error => console.log(error))
    
    // clear textarea
    textareaEl.value = '';

    // blur submit button
    textareaEl.blur();

    // reset counter
    counterEl.textContent = MAX_CHARS;
};

formEl.addEventListener('submit', submitHandler);

// -- FEEDBACK LIST COMPONENT --

const clickHandler = (e) => {
    // get clickedEl  HTML-element
    const clickedEl = e.target

    // determine if user instended to upvote or expand
    const upvoteIntention = clickedEl.className.includes('upvote');

    // run the appropriate logic
    if (upvoteIntention) {
        // get the closest upvote button
        const upvoteBtnEl = clickedEl.closest('.upvote');

        // disable upvote button (prevent double-clicks, spam)
        upvoteBtnEl.disabled = true;

        // select the upvote count element within the upvote button
        const upvoteCountEl = upvoteBtnEl.querySelector('.upvote__count');

        // get currently displayed upvote count as number (+)
        let upvoteCount = +upvoteCountEl.textContent
        upvoteCountEl.textContent = ++upvoteCount;
    } else {
        // expand the clicked feedback item
        clickedEl.closest('.feedback').classList.toggle('feedback--expand');
    }
}
feedbacksListEl.addEventListener('click', clickHandler)

fetch(`${BASE_API_URL}/feedbacks`)
    .then(responce => responce.json())
    .then(data => {

    // remove spinner
    spinnerEl.remove(); 
    
    // insert new feedback item in list
    data.feedbacks.map(feedbackItem => renderFeedbackItems(feedbackItem));
})
.catch(error => {
    feedbacksListEl.textContent = `Failed to fetch feedback items. Error message: ${error.message}`;
});