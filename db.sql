CREATE DATABASE "recipeDb" WITH OWNER = admin ENCODING = 'LATIN2' CONNECTION
LIMIT = - 1;

CREATE TABLE "user" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "login" VARCHAR(64) NOT NULL UNIQUE,
    "password" VARCHAR(64) NOT NULL,
    "accessToken" VARCHAR(64) ,
    "accessTokenExpiresAt" TIMESTAMP,
	"refreshToken" VARCHAR(64),
    "refreshTokenExpiresAt" TIMESTAMP
);

CREATE TABLE "recipe" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "name" VARCHAR(50) NOT NULL UNIQUE,
    "content" text NOT NULL,
    "preparationTime" INTEGER NOT NULL,
    "idUser" INTEGER NOT NULL,
	FOREIGN KEY ("idUser") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "ingredient" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "name" VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE "recipeIngredient" (
    "idRecipe" INTEGER NOT NULL,
    "idIngredient" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,
    "unit" VARCHAR(50) NOT NULL,
	FOREIGN KEY ("idRecipe") REFERENCES recipe("id") ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY ("idIngredient") REFERENCES ingredient("id") ON DELETE NO ACTION ON UPDATE CASCADE
);