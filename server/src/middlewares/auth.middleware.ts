import Wrapper from "../utils/asyncWrapper";
import SendJSONResponse from "../utils/response";

const AuthMiddleware = Wrapper(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    SendJSONResponse(res, false, 401, "Unauthorized");
    return;
  }

  next();
});

export default AuthMiddleware;
