"use strict";
exports.id = 968;
exports.ids = [968];
exports.modules = {

/***/ 8968:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "w": () => (/* binding */ BlogNewsletterForm)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _data_siteMetadata__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7059);
/* harmony import */ var _data_siteMetadata__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_data_siteMetadata__WEBPACK_IMPORTED_MODULE_2__);



const NewsletterForm = ({ title ='Subscribe to the newsletter'  })=>{
    const inputEl = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    const { 0: error1 , 1: setError  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const { 0: message , 1: setMessage  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('');
    const { 0: subscribed , 1: setSubscribed  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const subscribe = async (e)=>{
        e.preventDefault();
        const res = await fetch(`/api/${(_data_siteMetadata__WEBPACK_IMPORTED_MODULE_2___default().newsletter.provider)}`, {
            body: JSON.stringify({
                email: inputEl.current.value
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        });
        const { error  } = await res.json();
        if (error) {
            setError(true);
            setMessage('Your e-mail address is invalid or you are already subscribed!');
            return;
        }
        inputEl.current.value = '';
        setError(false);
        setSubscribed(true);
        setMessage('Successfully! 🎉 You are now subscribed.');
    };
    return(/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: "pb-1 text-lg font-semibold text-gray-800 dark:text-gray-100",
                children: title
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("form", {
                className: "flex flex-col sm:flex-row",
                onSubmit: subscribe,
                children: [
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                        children: [
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("label", {
                                className: "sr-only",
                                htmlFor: "email-input",
                                children: "Email address"
                            }),
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("input", {
                                autoComplete: "email",
                                className: "w-72 rounded-md px-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-600 dark:bg-black",
                                id: "email-input",
                                name: "email",
                                placeholder: subscribed ? "You're subscribed !  🎉" : 'Enter your email',
                                ref: inputEl,
                                required: true,
                                type: "email",
                                disabled: subscribed
                            })
                        ]
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                        className: "mt-2 flex w-full rounded-md shadow-sm sm:mt-0 sm:ml-3",
                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                            className: `w-full rounded-md bg-primary-500 py-2 px-4 font-medium text-white sm:py-0 ${subscribed ? 'cursor-default' : 'hover:bg-primary-700 dark:hover:bg-primary-400'} focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 dark:ring-offset-black`,
                            type: "submit",
                            disabled: subscribed,
                            children: subscribed ? 'Thank you!' : 'Sign up'
                        })
                    })
                ]
            }),
            error1 && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: "w-72 pt-2 text-sm text-red-500 dark:text-red-400 sm:w-96",
                children: message
            })
        ]
    }));
};
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ((/* unused pure expression or super */ null && (NewsletterForm)));
const BlogNewsletterForm = ({ title  })=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        className: "flex items-center justify-center",
        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
            className: "bg-gray-100 p-6 dark:bg-gray-800 sm:px-14 sm:py-8",
            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(NewsletterForm, {
                title: title
            })
        })
    })
;


/***/ })

};
;