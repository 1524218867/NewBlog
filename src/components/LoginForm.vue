<template>
    <div class="form-container">
        <h2>Sign in</h2>
        <el-form @submit.prevent="handleSubmit" class="ElFrom">
            <el-form-item>
                <el-input class="ElInp" v-model="form.email" placeholder="Email"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input class="ElInp" v-model="form.password" type="password" placeholder="Password"></el-input>
            </el-form-item>
            <el-button type="primary" class="BtnAft" @click="handleSubmit" block>Sign in</el-button>
        </el-form>
        <div class="divider">
            <span class="line"></span>
            <span class="text">or</span>
            <span class="line"></span>
        </div>
        <div class="signin-link">
            <small>
                Don't have an account? <a href="#" @click.prevent="toggleForm">Create account</a>
            </small>
        </div>
        <div class="social-buttons">
            <el-button class="FengXiangBtn" type="default" block>Continue with Google</el-button>
            <el-button class="FengXiangBtn" type="default" block>Continue with Apple</el-button>
            <el-button class="FengXiangBtn" type="default" block>Continue with Twitter</el-button>
        </div>
    </div>
</template>

<script>
export default {
    props: ['form', 'toggleForm'],
    methods: {
        handleSubmit() {
            this.$emit('submit');
        }
    }
};
</script>

<style scoped>
.form-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 2rem;
    background: #fff;

}

.form-container>h2 {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 2.5rem;
    font-weight: 600;
}

.ElFrom {
    text-align: center;
}

.ElInp {
    width: 60%;
    margin: auto;
}

.ElInp>>>.el-input__inner {
    border-radius: 8px;
    padding: 23px;
}


.BtnAft {
    width: 60%;
    background-color: black;
    color: white;
    border-radius: 8px;
    padding: 16px;
    z-index: 1;
    font-size: inherit;
    font-family: inherit;


    outline: none;
    border: none;

}

.BtnAft:hover {
    cursor: pointer;
    animation: jelly 0.5s;
}

@keyframes jelly {

    0%,
    100% {
        transform: scale(1, 1);
    }

    25% {
        transform: scale(0.9, 1.1);
    }

    50% {
        transform: scale(1.1, 0.9);
    }

    75% {
        transform: scale(0.95, 1.05);
    }
}


.divider {
    display: flex;
    align-items: center;
    text-align: center;
    margin: 20px auto;
    width: 60%;
}

.line {
    flex: 1;
    height: 1px;
    background-color: #ccc;
}

.text {
    margin: 0 10px;
    color: #000000;
    font-weight: bold;
}

.signin-link {
    text-align: center;
    width: 60%;
    margin: 0 auto 20px;
}

.signin-link>small>a {
    font-size: 16px;
    font-weight: bold;
    background: linear-gradient(45deg, #ff6b6b, #ffcc33);
    -webkit-background-clip: text;
    color: transparent;
}

.signin-link>small>a:hover {
    background: linear-gradient(45deg, #ffcc33, #ff6b6b);
    -webkit-background-clip: text;
}

.social-buttons {
    display: flex;
    flex-direction: column;
}

.social-buttons>button {
    width: 60%;
    margin: 10px auto;
    border-radius: 8px;
    padding: 16px;
}
</style>
