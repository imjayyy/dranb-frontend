import React, {useEffect} from 'react'
import Link from "next/link";
import {useRouter} from "next/router";
import {useStore} from "../hooks/currentUser";
import {getUser} from "../services";
import styles from '../styles/Home.module.scss'

const IndexPage = props =>  {
    const [user, updateUser] = useStore();
    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            let data
            try {
                data = await getUser()
                if(props.updateUser) {
                    props.updateUser(data.data)
                }
                updateUser(data.data);
                await router.push('/new-arrivals');
            } catch(e) {
                console.log(531,e)
                updateUser(false)
            }
        }
        fetchData()
    }, [])

    return (
        <div className={styles.container}>
            <div className={styles.textCenter}>
                <h1 className={styles.title}>DRANBS</h1>
                <h5 className={styles.subtitle}>create diversity</h5>
                <Link href={"/login"}>
                    <a className={styles.button}>login / sign up</a>
                </Link>
            </div>
        </div>
    )
}

export default IndexPage
