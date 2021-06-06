import UserRepository from "~/repository/UserRepository";
import AuthRepository from "./AuthRepository";

const repositories = {
  user: UserRepository,
  auth: AuthRepository
};
export default repositories;
