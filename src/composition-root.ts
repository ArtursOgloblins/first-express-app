import {UsersQueryRepository} from "./repositories/users/users-query-repo";
import {UsersRepository} from "./repositories/users/users-db-repo";
import {UsersService} from "./domain/users-service";
import {UserController} from "./controllers/user-controller";
import {AuthRepository} from "./repositories/auth/auth-db-repo";
import {AuthService} from "./domain/auth-service";
import {JwtService} from "./application/jwt-service";
import {AuthController} from "./controllers/auth-controller";
import {BlogsService} from "./domain/blogs-service";
import {BlogsRepository} from "./repositories/blogs/blogs-db-repository";
import {BlogsQueryRepository} from "./repositories/blogs/blogs-query-repo";
import {PostsService} from "./domain/posts-service";
import {PostsRepository} from "./repositories/posts/posts-db-repository";
import {BlogController} from "./controllers/blog-controller";
import {CommentsRepository} from "./repositories/comments/comments-db-repo";
import {CommentsQueryRepository} from "./repositories/comments/comments-query-repo";
import {CommentsService} from "./domain/comments-service";
import {CommentController} from "./controllers/comment-controller";
import {PostsQueryRepository} from "./repositories/posts/posts-query-repo";
import {PostController} from "./controllers/post-conroller";
import {SecurityService} from "./domain/security-service";
import {SecurityController} from "./controllers/security-controller";
import {TestRepository} from "./repositories/testRepository";
import {TestController} from "./controllers/test-controller";
import {RateLimit} from "./middleware/rateLimit";
import {TokenAuthenticator} from "./middleware/auth/authWithToken";


const usersQueryRepository = new UsersQueryRepository()
const usersRepository = new UsersRepository()
const authRepository = new AuthRepository()

const blogsQueryRepository = new BlogsQueryRepository()
const blogsRepository = new BlogsRepository()
const postsQueryRepository = new PostsQueryRepository()
const postsRepository = new PostsRepository()

const commentsQueryRepository = new CommentsQueryRepository()
const commentsRepository = new CommentsRepository()
const testRepository = new TestRepository()

const usersService = new UsersService(usersRepository)
const jwtService = new JwtService(authRepository)
const authService = new AuthService(authRepository, usersService, usersRepository, usersQueryRepository, jwtService)
const securityService = new SecurityService(authRepository, jwtService)


const blogsService = new BlogsService(blogsRepository)
const postsService = new PostsService(postsRepository, blogsQueryRepository)
const commentsService  = new CommentsService(commentsRepository, commentsQueryRepository)


export const userController = new UserController(usersQueryRepository, usersService)
export const authController = new AuthController(usersService, authRepository, authService, jwtService, usersQueryRepository)
export const securityController = new SecurityController(authRepository, securityService, jwtService)
export const blogController = new BlogController(blogsQueryRepository, blogsService, postsService)
export const  postController = new PostController(postsQueryRepository, postsService, commentsService, commentsQueryRepository)
export const commentController = new CommentController(commentsQueryRepository, commentsService)


export const rateLimit = new RateLimit(usersService, usersQueryRepository)
export const rateLimitValidation = rateLimit.rateLimitValidation.bind(rateLimit)
export const tokenAuthenticator = new TokenAuthenticator(jwtService, usersQueryRepository)
export const authWithToken = tokenAuthenticator.authWithToken.bind(tokenAuthenticator)

export const testController = new TestController(testRepository)