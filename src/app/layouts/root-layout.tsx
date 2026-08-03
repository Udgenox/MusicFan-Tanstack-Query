import {Outlet} from "@tanstack/react-router"
import {AccountBar} from "../../features/auth/ui/account-bar";
import {Header} from "../../shared/ui/header/header";
import styles from "./root-layout.module.css"

export const RootLayout = () => (
    <>
        <Header renderAccountBar={() => <AccountBar />} />
        <div className={styles.container}>
            <Outlet />
        </div>

    </>
)