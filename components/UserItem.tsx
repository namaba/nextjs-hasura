import { Dispatch, SetStateAction, VFC } from 'react'
import { DeleteUserMutationFn, Users } from '../types/generated/graphql'

type Props = {
  user: {
    __typename?: 'users'
  } & Pick<Users, 'id' | 'name' | 'created_at'>
  delete_users_by_pk: DeleteUserMutationFn
  setEditedUser: Dispatch<
    SetStateAction<{
      id: string
      name: string
    }>
  >
}

export const UserItem: VFC<Props> = ({
  user,
  delete_users_by_pk,
  setEditedUser,
}) => {}
