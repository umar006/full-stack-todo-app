package models

import (
	"fmt"
	"strings"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID       uuid.UUID `json:"id"`
	Username string    `json:"username"`
	Password string    `json:"password,omitempty"`
}

func (u *User) HashPassword() error {
	hashed, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	u.Password = string(hashed)

	return nil
}

func (u *User) CheckPasswordHash(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
	return err == nil
}

func (u *User) Validate() error {
	if strings.TrimSpace(u.Username) == "" || strings.TrimSpace(u.Password) == "" {
		return fmt.Errorf("username or password cannot be empty")
	}

	if len(strings.Split(u.Username, " ")) > 1 || len(strings.Split(u.Password, " ")) > 1 {
		return fmt.Errorf("username or password cannot contains whitespace")
	}

	return nil
}
