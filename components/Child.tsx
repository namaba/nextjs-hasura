import { FormEvent, memo, VFC } from 'react'

type Props = {
  printMsg: () => void
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>
}

const Child: VFC<Props> = ({ printMsg, handleSubmit }) => {
  return (
    <>
      {console.log('Child rendered')}
      <p>Child Component</p>
      <button
        className="my-3 py-1 px-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl forcus:outline-none"
        type="submit"
        onClick={printMsg}
      >
        click
      </button>
    </>
  )
}

export default memo(Child)
