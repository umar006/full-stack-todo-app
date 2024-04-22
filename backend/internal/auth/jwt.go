package auth

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
	"todo.umaru.run/internal/models"
)

var (
	JWT_SIGNATURE_KEY     = []byte(os.Getenv("JWT_SIGNATURE_KEY"))
	JWT_EXPIRE_IN_HOUR, _ = time.ParseDuration(os.Getenv("JWT_EXPIRE_IN_HOUR"))
)

type Claims struct {
	ID       uuid.UUID `json:"id"`
	Username string    `json:"username"`
	jwt.StandardClaims
}

func GenerateJwt(user models.User) (string, error) {
	expirationTime := time.Now().Add(JWT_EXPIRE_IN_HOUR).Unix()
	claims := Claims{
		ID:       user.ID,
		Username: user.Username,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime,
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString(JWT_SIGNATURE_KEY)
}
