export interface Person {
  id: string
  name: string
  age: number
}

export interface CreatePersonDto {
  name: string
  age: number
}

export interface UpdatePersonDto {
  name: string
  age: number
}