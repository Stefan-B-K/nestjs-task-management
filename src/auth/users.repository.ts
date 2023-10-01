import { DataSource, Repository } from "typeorm";
import { User } from "./user.entity";
import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersRepository extends Repository<User> {

  constructor (private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async addUser (authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto
    
    const salt = await bcrypt.genSalt()
    const hashedSaltedPassword = await bcrypt.hash(password, salt)
    
    const user = this.create({ username, password: hashedSaltedPassword })

    try {
      await this.save(user)
    } catch (err) {
      if (err.code === 23505) {           // duplicate unique in DB
        throw new ConflictException("Username already exists")
      } else {
        throw new InternalServerErrorException()
      }
    }
  }

}
