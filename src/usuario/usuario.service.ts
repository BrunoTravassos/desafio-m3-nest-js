import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PrismaService } from 'src/database/prisma.service';
import * as bcrypt from "bcrypt";
import {v4 as uuidv4} from 'uuid';

@Injectable()
export class UsuarioService {
  constructor(private readonly prisma: PrismaService){}
  
  async validarCampos(usuario:CreateUsuarioDto){
    if (!usuario.nome || !usuario.email || !usuario.senha) {
      return null
    }
    return usuario
  }

  async create(createUsuarioDto: CreateUsuarioDto) {

    const verificaCampos = await this.validarCampos(createUsuarioDto);

    if(verificaCampos===null){
      throw new BadRequestException(
        'Todos os campos devem ser obrigatorios'
      );
    }
    try {
      const senhaCriptografada = await bcrypt.hash(createUsuarioDto.senha,10);

      return await this.prisma.usuarios.create({
        data:{
          id: uuidv4(),
          nome: createUsuarioDto.nome,
          email: createUsuarioDto.email,
          senha: senhaCriptografada,
        },
      });
      
    } catch (error) {
      const erro = error as Error;
      throw new BadRequestException({
        message: erro.message,
      });
    }
  }

  async findAll() {
    const usuarios = await this.prisma.usuarios.findMany()
    return usuarios;
  }

  async findOne(email: string) {
    console.log(email)
    const usuario = await this.prisma.usuarios.findUnique({
      where:{
        email
      },
    }) 
    return usuario;
  }

  async findEmail(email:string){

    const usuario = await this.prisma.usuarios.findUnique({
      where:{
        email
      },
    });

    return usuario

  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}
