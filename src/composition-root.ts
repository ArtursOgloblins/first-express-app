import "reflect-metadata";
import {UsersQueryRepository} from "./infrastructure/repositories/users/users-query-repo";
import {UsersRepository} from "./infrastructure/repositories/users/users-db-repo";
import {UsersService} from "./application/services/users-service";
import {UserController} from "./controllers/user-controller";
import {AuthRepository} from "./infrastructure/repositories/auth/auth-db-repo";
import {AuthService} from "./application/services/auth-service";
import {JwtService} from "./application/services/jwt-service";
import {AuthController} from "./controllers/auth-controller";
import {BlogsService} from "./application/services/blogs-service";
import {BlogsRepository} from "./infrastructure/repositories/blogs/blogs-db-repository";
import {BlogsQueryRepository} from "./infrastructure/repositories/blogs/blogs-query-repo";
import {PostsService} from "./application/services/posts-service";
import {PostsRepository} from "./infrastructure/repositories/posts/posts-db-repository";
import {BlogController} from "./controllers/blog-controller";
import {CommentsRepository} from "./infrastructure/repositories/comments/comments-db-repo";
import {CommentsQueryRepository} from "./infrastructure/repositories/comments/comments-query-repo";
import {CommentsService} from "./application/services/comments-service";
import {CommentController} from "./controllers/comment-controller";
import {PostsQueryRepository} from "./infrastructure/repositories/posts/posts-query-repo";
import {PostController} from "./controllers/post-conroller";
import {SecurityService} from "./application/services/security-service";
import {SecurityController} from "./controllers/security-controller";
import {TestRepository} from "./infrastructure/repositories/testRepository";
import {TestController} from "./controllers/test-controller";
import {RateLimit} from "./middleware/rateLimit";
import {TokenAuthenticator} from "./middleware/auth/authWithToken";
import {AccessTokenChecker} from "./middleware/auth/accessTokenChecker";
import {Container} from "inversify";
import {LikesService} from "./application/services/likes-service";
import {LikesRepository} from "./infrastructure/repositories/likes/likes-db-reposiry";
import {PostsInputValidation} from "./middleware/posts/postsInputValidation";


export const container = new Container()

// Controllers
container.bind(UserController).to(UserController)
container.bind(AuthController).to(AuthController)
container.bind(SecurityController).to(SecurityController)
container.bind(BlogController).to(BlogController)
container.bind(PostController).to(PostController)
container.bind(CommentController).to(CommentController)
container.bind(TestController).to(TestController)


// Services
container.bind(BlogsService).to(BlogsService)
container.bind(PostsService).to(PostsService)
container.bind(UsersService).to(UsersService)
container.bind(JwtService).to(JwtService)
container.bind(AuthService).to(AuthService)
container.bind(SecurityService).to(SecurityService)
container.bind(CommentsService).to(CommentsService)
container.bind(LikesService).to(LikesService)


//Repositories
container.bind(TestRepository).to(TestRepository)
container.bind(UsersRepository).to(UsersRepository)
container.bind(UsersQueryRepository).to(UsersQueryRepository)
container.bind(AuthRepository).to(AuthRepository)
container.bind(BlogsQueryRepository).to(BlogsQueryRepository)
container.bind(BlogsRepository).to(BlogsRepository)
container.bind(PostsRepository).to(PostsRepository)
container.bind(PostsQueryRepository).to(PostsQueryRepository)
container.bind(CommentsRepository).to(CommentsRepository)
container.bind(CommentsQueryRepository).to(CommentsQueryRepository)
container.bind(LikesRepository).to(LikesRepository)

//Validations
container.bind(RateLimit).to(RateLimit)
container.bind(TokenAuthenticator).to(TokenAuthenticator)
container.bind(AccessTokenChecker).to(AccessTokenChecker)
container.bind(PostsInputValidation).to(PostsInputValidation)
export const rateLimiter = container.resolve(RateLimit).rateLimitMiddleware()
export const tokenAuthenticator = container.resolve(TokenAuthenticator).authWithTokenMiddleware()
export const accessTokenChecker = container.resolve(AccessTokenChecker).checkTokenMiddleware()
