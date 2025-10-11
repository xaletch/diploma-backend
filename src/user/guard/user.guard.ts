import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { UserService } from "../user.service";

@Injectable()
export class LoadUserGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(cxt: ExecutionContext): Promise<boolean> {
    const req = cxt.switchToHttp().getRequest();
    const userId = req.user.id;
    if (!userId) return false;

    req.user = await this.userService.currentUser(userId);

    return true;
  }
}
