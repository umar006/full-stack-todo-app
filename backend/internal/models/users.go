package models

import (
	"crypto/sha256"
	"fmt"
	"strings"

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

func (u *User) Validate() error {
	if strings.TrimSpace(u.Username) == "" || strings.TrimSpace(u.Password) == "" {
		return fmt.Errorf("username or password cannot be empty")
	}

	if len(strings.Split(u.Username, " ")) > 1 || len(strings.Split(u.Password, " ")) > 1 {
		return fmt.Errorf("username or password cannot contains whitespace")
	}

	return nil
}
