/*jshint esversion: 6 */

//focus on name field on load
document.getElementById('name').focus();


//job role section
//hide by default
const otherJobRole = document.getElementById('other-job-role');
otherJobRole.style.display = 'none';

//show when 'other' is selected 
document.getElementById('title').addEventListener('change', function () {
    if (this.value === 'other') {
        otherJobRole.style.display = 'block';
    } else {
        otherJobRole.style.display = 'none';
    }
});


//tshirt info section
const colorSelect = document.getElementById('color');
const designSelect = document.getElementById('design');

//disable color element
colorSelect.disabled = true;

//enable color element based on design
designSelect.addEventListener('change', function () {
    colorSelect.disabled = false;
    switch (this.value) {
        case 'js puns':
            //hide last three options
            for (let i = 6; i > 3; i--) {
                colorSelect.options[i].hidden = true;
            }
            for (let i = 1; i <= 3; i++) {
                colorSelect.options[i].hidden = false;
            }
            break;
        case 'heart js':
            //hide first three options
            for (let i = 1; i <= 3; i++) {
                colorSelect.options[i].hidden = true;
            }
            for (let i = 6; i > 3; i--) {
                colorSelect.options[i].hidden = false;
            }
            break;
    }
});


//register for activities section
//on change, update sum to reflect cost
const priceElement = document.getElementById('activities-cost');
const activityElements = document.querySelectorAll('#activities label');
const checkboxes = document.querySelector('#activities').querySelectorAll('input[type=checkbox]');

document.getElementById('activities').addEventListener('change', function (e) {
    let totalPrice = 0;

    for (let i = 0; i < activityElements.length; i++) {
        let checkboxChecked = activityElements[i].querySelector('input').checked;
        let price = parseInt(activityElements[i].querySelector('.activity-cost').textContent.slice(1));
        checkboxChecked ? totalPrice += price : totalPrice;

        //check for conflicting elements
        //when user selects activity, check for any that match the one that was just changed
        let checkbox = activityElements[i].querySelector('input');

        if (checkbox.getAttribute('data-day-and-time') === e.target.getAttribute('data-day-and-time')) {
            if (e.target.name != checkbox.getAttribute('name') && checkboxChecked) {
                if (e.target.checked) {
                    checkbox.disabled = true;
                    checkbox.parentNode.classList.add('disabled');
                } else {
                    checkbox.disabled = false;
                    checkbox.parentNode.classList.remove('disabled');
                }
            } else {
                checkbox.disabled = false;
            }
        }
    }
    //update total price
    priceElement.textContent = `Total: $${totalPrice}`;
});

//make focus states more obvious
//handler helper fns
const focusHandler = event => {
    event.target.className = 'focus';
    document.getElementsByClassName('blur').className = '';
}
const blurHandler = event => {
    event.target.className = 'blur';
    document.getElementsByClassName('focus').className = '';
}
//attach handler to all checkbox inputs
checkboxes.forEach(box => box.addEventListener('focus', focusHandler));
checkboxes.forEach(box => box.addEventListener('blur', blurHandler));

//payment info section
const paymentMethods = ['credit-card', 'paypal', 'bitcoin'];
//select credit card by default
document.getElementById('payment').options[1].selected = true;
//display only credit card section by default
paymentMethods.filter(method => method != 'credit-card').forEach(method => document.querySelector(`#${method}`).style.display = 'none');

document.getElementById('payment').addEventListener('change', function () {
    document.querySelector(`#${this.value}`).style.display = 'block';
    paymentMethods.filter(method => method != this.value).forEach(method => document.querySelector(`#${method}`).style.display = 'none');
});


//form validation
//helper fn to change parent class
function tagValid(element) {
    element.parentNode.classList.add('valid');
    element.parentNode.classList.remove('not-valid');
    element.parentNode.lastElementChild.style.display = 'none';
}
function tagInvalid(element) {
    element.parentNode.classList.add('not-valid');
    element.parentNode.classList.remove('valid');
    element.parentNode.lastElementChild.style.display = 'block';
}

function checkName(name) {
    const hint = document.querySelector('#name-hint');
    let regExName = (/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/g).test(name.value);
    if (name.value.length > 1 && regExName) {
        tagValid(name);
        return true;
    } else {
        tagInvalid(name);
        if (name.value.length < 1) {
            console.log('name field cannot be blank');
            hint.textContent = 'Name field cannot be blank';
        } else if (!regExName) {
            console.log('name field must contain letter characters');
            hint.textContent = 'Name field must contain letters';
        }
        return false;
    }
}

function checkEmail(email) {
    const regExEmail = /^\S+@+\S+\.com+$/;
    const hint = document.querySelector('#email-hint');
    if (regExEmail.test(email.value)) {
        tagValid(email);
        return true;
    } else {
        console.log('email is invalid');
        tagInvalid(email);
        if(email.value.length < 1) {
            hint.textContent = 'Email address cannot be blank';
        } else if(!regExEmail.test(email.value)) {
            hint.textContent = 'Email address must follow address@domain.com format';
        }
        return false;
    }
}

function checkActivities() {
    const checkboxes = Array.from(document.querySelectorAll('#activities input[type=checkbox]'));
    const checked = checkboxes
        .filter(checkbox => checkbox.checked)
        .reduce((total, box) => box.checked ? total + 1 : total, 0);
    if (checked > 0) {
        tagValid(document.querySelector('#activities-box'));
        return true;
    } else {
        console.log('must select at least one activity');
        tagInvalid(document.querySelector('#activities-box'));
        return false;
    }
}

function checkCreditCard(info) {
    //test against regex
    function regExTest(reg, ele) {
        let result = reg.test(ele.value);
        return result;
    }

    //create arrays
    //array of arguments passed to fn
    let args = Array.from(info);
    //array of regex expressions for cc num, zip, and cvv
    //(looks for matching only digits with specified lengths)
    let regExMatches = [/^\d{13,16}$/, /^\d{5}$/, /^\d{3}$/];

    //loop through arrays
    let test;
    for (let i = 0; i < args.length; i++) {
        test = regExTest(regExMatches[i], args[i]);
        if (test == true) {
            tagValid(args[i]);
        } else {
            tagInvalid(args[i]);
        }
    }

    if (!test) console.log('cc info is invalid');
    return test;
}

//validator helper fn
function validateInput(validator, input, evt) {
    if (!validator(input)) {
        evt.preventDefault();
    } else {
        return true;
    }
}

//validate form on submit
document.querySelector('form').addEventListener('submit', function (e) {
    validateInput(checkName, e.target[1], e);
    validateInput(checkEmail, e.target[2], e);
    validateInput(checkActivities, e, e);
    if (e.target[18].value === 'credit-card') {
        let ccElem = [e.target[21], e.target[22], e.target[23]];
        validateInput(checkCreditCard, ccElem, e);
    }
});

document.querySelectorAll('form fieldset:not(.shirts):not(#activities)').forEach(function (box) {
    box.addEventListener('keyup', function (e) {
        let raw = e.target.name.slice(5);
        let inputName = raw.charAt(0).toUpperCase() + raw.slice(1).toString();
        let thisInput = 'check' + inputName;

        if (inputName === 'Name' || inputName === 'Email') {
            validateInput(eval(thisInput), e.target, e);
        } else if (e.target.parentNode.parentNode.parentNode.className === 'credit-card-box') {
            let ccElem = [];
            for (let i = 21; i < 24; i++) {
                let elem = e.target.form[i];
                ccElem.push(elem);
            }
            validateInput(checkCreditCard, ccElem, e);
        }
    });

    //console.log(box.getElementsByTagName('input'));
});
// addEventListener('keyup', function(e) {
//     console.log(e.target.name);
//     if(e.target.name === 'user-name') {
//         validateInput(checkName, e.target, e);
//     } else if(e.target.name === 'user-email') {
//         validateInput(checkEmail, e.target, e);
//     }
// });