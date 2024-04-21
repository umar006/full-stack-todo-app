package models

import (
	"crypto/sha256"
	"fmt"

	"github.com/google/uuid"
)

type User struct {
	ID       uuid.UUID `json:"id"`
	Username string    `json:"username"`
	Password string    `json:"password,omitempty"`
}

func (u *User) HashPassword() error {
	hash := sha256.New()
	_, err := hash.Write([]byte(u.Password))
	if err != nil {
		return err
	}

	u.Password = fmt.Sprintf("%x", hash.Sum(nil))

	return nil
}
