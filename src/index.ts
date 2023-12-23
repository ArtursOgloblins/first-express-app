import {runDb} from "./infrastructure/repositories/db";
import {initApp} from "./initApp";

const app = initApp();

const PORT = process.env.PORT || 3000;


const startApp = async () => {
    await runDb()
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

startApp().catch(err => {
    console.error("Failed to start app", err);
});
