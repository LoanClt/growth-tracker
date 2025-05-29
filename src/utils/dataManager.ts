
export interface FormData {
  revenue: number;
  trl: number;
  ip: string;
  date: string;
  username: string;
}

export interface Account {
  username: string;
  password: string;
  formOpen: boolean;
}

export const saveFormData = (data: Omit<FormData, 'date' | 'username'>, username: string): void => {
  const formEntry: FormData = {
    ...data,
    date: new Date().toISOString(),
    username
  };
  
  const existingData = JSON.parse(localStorage.getItem('formData') || '[]');
  existingData.push(formEntry);
  localStorage.setItem('formData', JSON.stringify(existingData));
  
  // Auto-close form after submission
  closeFormForUser(username);
};

export const getUserData = (username: string): FormData[] => {
  const allData = JSON.parse(localStorage.getItem('formData') || '[]');
  return allData.filter((entry: FormData) => entry.username === username);
};

export const getAllData = (): FormData[] => {
  return JSON.parse(localStorage.getItem('formData') || '[]');
};

export const createAccount = (username: string, password: string): boolean => {
  const existingAccounts = JSON.parse(localStorage.getItem('accounts') || '[]');
  
  // Check if account already exists
  if (existingAccounts.some((acc: Account) => acc.username === username)) {
    return false;
  }
  
  const newAccount: Account = { username, password, formOpen: true };
  existingAccounts.push(newAccount);
  localStorage.setItem('accounts', JSON.stringify(existingAccounts));
  return true;
};

export const getAllAccounts = (): Account[] => {
  const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
  const defaultAccounts: Account[] = [
    { username: 'admin', password: 'admin', formOpen: true },
    { username: 'test', password: 'test', formOpen: true }
  ];
  
  // Merge default accounts with custom ones, avoiding duplicates
  const existingUsernames = accounts.map((acc: Account) => acc.username);
  const filteredDefaults = defaultAccounts.filter(acc => !existingUsernames.includes(acc.username));
  
  return [...filteredDefaults, ...accounts];
};

export const getAllUsernames = (): string[] => {
  const accounts = getAllAccounts();
  return accounts.map(acc => acc.username);
};

export const deleteAccount = (username: string): boolean => {
  if (username === 'admin' || username === 'test') {
    return false; // Cannot delete default accounts
  }
  
  const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
  const filteredAccounts = accounts.filter((acc: Account) => acc.username !== username);
  localStorage.setItem('accounts', JSON.stringify(filteredAccounts));
  
  // Also remove all data for this user
  const allData = getAllData();
  const filteredData = allData.filter(entry => entry.username !== username);
  localStorage.setItem('formData', JSON.stringify(filteredData));
  
  return true;
};

export const updateAccountCredentials = (oldUsername: string, newUsername: string, newPassword: string): boolean => {
  const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
  const defaultAccounts = ['admin', 'test'];
  
  // Find account to update
  if (defaultAccounts.includes(oldUsername)) {
    // Update default accounts differently
    const allAccounts = getAllAccounts();
    const accountIndex = allAccounts.findIndex(acc => acc.username === oldUsername);
    if (accountIndex === -1) return false;
    
    // For default accounts, we need to add them to localStorage to override
    const existingCustomAccounts = JSON.parse(localStorage.getItem('accounts') || '[]');
    const updatedAccount = { ...allAccounts[accountIndex], username: newUsername, password: newPassword };
    
    if (oldUsername !== newUsername) {
      // If username changed, add new account and mark old as deleted
      existingCustomAccounts.push(updatedAccount);
      existingCustomAccounts.push({ username: oldUsername, password: '', formOpen: false, deleted: true });
    } else {
      // Just update password
      existingCustomAccounts.push(updatedAccount);
    }
    
    localStorage.setItem('accounts', JSON.stringify(existingCustomAccounts));
  } else {
    // Update custom account
    const accountIndex = accounts.findIndex((acc: Account) => acc.username === oldUsername);
    if (accountIndex === -1) return false;
    
    accounts[accountIndex].username = newUsername;
    accounts[accountIndex].password = newPassword;
    localStorage.setItem('accounts', JSON.stringify(accounts));
  }
  
  // Update username in all form data if username changed
  if (oldUsername !== newUsername) {
    const allData = getAllData();
    const updatedData = allData.map(entry => 
      entry.username === oldUsername 
        ? { ...entry, username: newUsername }
        : entry
    );
    localStorage.setItem('formData', JSON.stringify(updatedData));
  }
  
  return true;
};

export const isFormOpenForUser = (username: string): boolean => {
  const accounts = getAllAccounts();
  const account = accounts.find(acc => acc.username === username);
  return account?.formOpen ?? false;
};

export const toggleFormForUser = (username: string, isOpen: boolean): void => {
  const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
  const defaultAccounts = ['admin', 'test'];
  
  if (defaultAccounts.includes(username)) {
    // For default accounts, add override to localStorage
    const existingAccount = accounts.find((acc: Account) => acc.username === username);
    if (existingAccount) {
      existingAccount.formOpen = isOpen;
    } else {
      const allAccounts = getAllAccounts();
      const defaultAccount = allAccounts.find(acc => acc.username === username);
      if (defaultAccount) {
        accounts.push({ ...defaultAccount, formOpen: isOpen });
      }
    }
  } else {
    // Update custom account
    const accountIndex = accounts.findIndex((acc: Account) => acc.username === username);
    if (accountIndex !== -1) {
      accounts[accountIndex].formOpen = isOpen;
    }
  }
  
  localStorage.setItem('accounts', JSON.stringify(accounts));
};

export const closeFormForUser = (username: string): void => {
  toggleFormForUser(username, false);
};
