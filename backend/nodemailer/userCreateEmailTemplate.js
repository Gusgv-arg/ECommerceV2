export const userCreateEmailTemplate = (user) => {
    return `<h1>Thanks for registering at E-CommerceV2!</h1>
    <p>Hi ${user.name},</p>
    <p>Your account has been succesfully created with your email ${user.email}</p>    
    <p>Thanks for shopping with us!</p>
    <br>
    <p>E-CommerceV2 team.</p>
    `;
  };