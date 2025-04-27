```html
<body data-theme="light">
    <div class="sidebar" id="sidebar">
        <div class="sidebar-item" title="Home" aria-label="Home">
            <i class="fas fa-home"></i>
        </div>
        <div class="sidebar-item" title="Account" aria-label="Account">
            <i class="fas fa-user"></i>
        </div>
        <div class="sidebar-item" title="Message" aria-label="Messages">
            <i class="fas fa-envelope"></i>
        </div>
        <div class="sidebar-item" title="Forum" aria-label="Forum">
            <i class="fas fa-comments"></i>
        </div>
        <div class="sidebar-item" title="Report" aria-label="Report">
            <i class="fas fa-flag"></i>
        </div>
        <div class="sidebar-item" title="Settings" aria-label="Settings">
            <i class="fas fa-cog"></i>
        </div>
        <div class="sidebar-item" title="Sign Out" aria-label="Sign Out">
            <i class="fas fa-right-from-bracket"></i>
        </div>
        <div class="sidebar-item" title="Login" aria-label="Login">
            <i class="fas fa-right-to-bracket"></i>
        </div>
        <div class="sidebar-item" title="Register" aria-label="Register">
            <i class="fas fa-user-plus"></i>
        </div>
        <div class="sidebar-item" title="Forgot Password" aria-label="Forgot Password">
            <i class="fas fa-key"></i>
        </div>
        <!-- Theme toggle added by VanJS -->
    </div>
    <div class="main-content">
        <div class="cheader">
            <h1>Header</h1>
        </div>
        <div class="ccontent">
            <p>Content goes here...</p>
            <!-- Example Buttons -->
            <button class="normal">Normal Button</button>
            <button class="warn">Warn Button</button>
            <button class="error">Error Button</button>
            <button class="alert">Alert Button</button>
            <!-- Example Inputs -->
            <input type="text" placeholder="Text Input">
            <input type="email" placeholder="Email Input">
            <input type="password" placeholder="Password Input">
            <input type="number" placeholder="Number Input">
            <input type="text" placeholder="Disabled Input" disabled>
            <input type="text" class="error" placeholder="Error Input">
            <!-- Example Select -->
            <select>
                <option value="">Select an option</option>
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
                <option value="3">Option 3</option>
            </select>
            <select disabled>
                <option value="">Disabled Select</option>
                <option value="1">Option 1</option>
            </select>
            <select class="error">
                <option value="">Error Select</option>
                <option value="1">Option 1</option>
            </select>
            <!-- Example Toggle Checkbox -->
            <label class="toggle-container">
                <input type="checkbox" class="toggle-checkbox" aria-label="Toggle Setting">
                <span class="toggle-label"></span>
            </label>
            <label class="toggle-container">
                <input type="checkbox" class="toggle-checkbox" disabled aria-label="Disabled Toggle">
                <span class="toggle-label"></span>
            </label>
        </div>
    </div>
</body>
```