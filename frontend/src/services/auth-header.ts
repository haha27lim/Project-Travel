export default function authHeader() {
  const userStr = localStorage.getItem("user");
  let user = null;
  
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      localStorage.removeItem("user");
      return {};
    }
  }

  if (user && user.token) {
    return { 
      'Authorization': 'Bearer ' + user.token,
      'Content-Type': 'application/json'
    };
  } else {
    return {};
  }
} 