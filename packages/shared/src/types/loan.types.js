"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmploymentMode = exports.ApplicationStatus = exports.LoanStatus = void 0;
var LoanStatus;
(function (LoanStatus) {
    LoanStatus["PENDING"] = "PENDING";
    LoanStatus["APPROVED"] = "APPROVED";
    LoanStatus["REJECTED"] = "REJECTED";
    LoanStatus["DISBURSED"] = "DISBURSED";
    LoanStatus["CLOSED"] = "CLOSED";
})(LoanStatus || (exports.LoanStatus = LoanStatus = {}));
var ApplicationStatus;
(function (ApplicationStatus) {
    ApplicationStatus["DRAFT"] = "DRAFT";
    ApplicationStatus["BRE_FAILED"] = "BRE_FAILED";
    ApplicationStatus["APPLIED"] = "APPLIED";
})(ApplicationStatus || (exports.ApplicationStatus = ApplicationStatus = {}));
var EmploymentMode;
(function (EmploymentMode) {
    EmploymentMode["SALARIED"] = "SALARIED";
    EmploymentMode["SELF_EMPLOYED"] = "SELF_EMPLOYED";
    EmploymentMode["UNEMPLOYED"] = "UNEMPLOYED";
})(EmploymentMode || (exports.EmploymentMode = EmploymentMode = {}));
