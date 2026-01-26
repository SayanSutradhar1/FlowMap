import { db } from "../config/prisma";
import Wrapper from "../utils/asyncWrapper";
import SendJSONResponse from "../utils/response";

const CheckUserExistance = Wrapper(async (req, res, next) => {
  const { id } = req.params;

  const user = await db.user.findUnique({
    where: { id },
  });

  if (!user) {
    SendJSONResponse(res, false, 404, "User not found");
    return;
  }

  req.body.user = user;

  next();
});

export { CheckUserExistance };

