import { useMutation, useQuery } from '@apollo/client'
import { FormEvent, useState, VFC } from 'react'
import { Layout } from '../components/Layout'
import {
  CREATE_USER,
  DELETE_USER,
  GET_USERS,
  UPDATE_USER,
} from '../queries/queries'
import {
  CreateUserMutation,
  DeleteUserMutation,
  GetUsersQuery,
  UpdateUserMutation,
} from '../types/generated/graphql'

const HasuraCRUD: VFC = () => {
  const [editedUser, setEditedUser] = useState({ id: '', name: '' })
  const { data, error } = useQuery<GetUsersQuery>(GET_USERS, {
    fetchPolicy: 'cache-and-network',
  })

  const [update_users_by_pk] = useMutation<UpdateUserMutation>(UPDATE_USER)
  const [insert_users_one] = useMutation<CreateUserMutation>(CREATE_USER, {
    update(cache, { data: { insert_users_one } }) {
      const cacheId = cache.identify(insert_users_one)
      cache.modify({
        fields: {
          users(existingUsers, { toReference }) {
            return [toReference(cacheId), ...existingUsers]
          },
        },
      })
    },
  })
  const [delete_users_by_pk] = useMutation<DeleteUserMutation>(DELETE_USER, {
    update(cache, { data: { delete_users_by_pk } }) {
      cache.modify({
        fields: {
          fields: {
            users(existingUsers, { readField }) {
              return existingUsers.filter(
                (user) => delete_users_by_pk.id !== readField('id', user)
              )
            },
          },
        },
      })
    },
  })

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (editedUser.id) {
      try {
        await update_users_by_pk({
          variables: {
            id: editedUser.id,
            name: editedUser.name,
          },
        })
      } catch (err) {
        alert(err.message)
      }
      setEditedUser({ id: '', name: '' })
    } else {
      try {
        await insert_users_one({
          variables: {
            name: editedUser.name,
          },
        })
      } catch (err) {
        alert(err.message)
      }
      setEditedUser({ id: '', name: '' })
    }
  }

  return (
    <Layout title="Hasura CRUD">
      <p className="mb-3 font-bold">Hasura CRUD</p>
      <form
        className="flex flex-col justfy-center items-center"
        onSubmit={handleSubmit}
      >
        <input
          className="px-3 py-2 border border-gray-300"
          placeholder="New user ?"
          value={editedUser.name}
          onChange={(e) =>
            setEditedUser({ ...editedUser, name: e.target.value })
          }
        />
        <button disabled={!editedUser.name} data-testid="new" type="submit">
          {editedUser.id ? 'Update' : 'Create'}
        </button>
      </form>
    </Layout>
  )
}

export default HasuraCRUD
