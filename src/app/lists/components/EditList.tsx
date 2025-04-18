"use client"
import { Suspense } from "react"
import updateList from "../mutations/updateList"
import getList from "../queries/getList"
import { UpdateListSchema } from "../schemas"
import { FORM_ERROR, ListForm } from "./ListForm"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { useRouter } from "next/navigation"
import styles from "../../styles/Home.module.css"

export const EditList = ({ listId }: { listId: number }) => {
  const [list, { setQueryData }] = useQuery(
    getList,
    { id: listId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateListMutation] = useMutation(updateList)
  const router = useRouter()
  const itemNames: string[] = []
  list.items.forEach((value) => {
    !itemNames.includes(value.name) ? itemNames.push(value.name) : {}
  })
  return (
    <>
      <div>

        <div className={styles.globe} />
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <h1><strong>Edit</strong> {list.name}</h1>
          </div>
        
          <div className={styles.centerList}>
            <Suspense fallback={<div>Loading...</div>}>
              <ListForm
                submitText="Update List"
                schema={UpdateListSchema}
                initialValues={{ id: list.id, name: list.name, items: itemNames }}
                onSubmit={async (values) => {
                  try {
                    const updated = await updateListMutation(values)
                    await setQueryData(updated)
                    router.refresh()
                    router.push(`/lists/${list.id}`)
                  } catch (error: any) {
                    console.error(error)
                    return {
                      [FORM_ERROR]: error.toString(),
                    }
                  }
                }}
              />
            </Suspense>
          </div>

        </div>
      </div>
    </>
  )
}
