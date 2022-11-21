"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controller/userController");
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.send("Hi You are in home route...");
});
router.post('/save', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('Got body:', req.body);
    const database = yield userController_1.userController.apiCall(JSON.stringify(req.body));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(req.body));
}));
exports.default = { router };
//# sourceMappingURL=user.js.map