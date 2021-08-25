const baseResponseStatus = require("../../../config/baseResponseStatus");
const { pool } = require("../../../config/database");
const { errResponse } = require("../../../config/response");
const { logger } = require("../../../config/winston");

const wannaGoDao = require("./wannaGoDao");

// Provider: Read 비즈니스 로직 처리
