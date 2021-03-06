import {useCallback, useEffect, useReducer, useRef} from 'react'

const api = {
    uploadFile({ timeout = 550 }) {
        console.log("file upload function")
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve()
        }, timeout)
      })
    },
}

const logUploadedFile = (num, color = 'green') => {
    const msg = `%cUploaded ${num} files.`
    const style = `color:${color};font-weight:bold;`
    console.log(msg, style)
}

const LOADED = 'LOADED'
const INIT = 'INIT'
const PENDING = 'PENDING'
const FILES_UPLOADED = 'FILES_UPLOADED'
const UPLOAD_ERROR = 'UPLOAD_ERROR'

const initialState = {
    files: [],
    pending: [],
    next: null,
    uploading: false,
    uploaded: {},
    status: 'idle',
}

const reducer = (state, action) =>{
    switch(action.type){
        case 'load':
            return{...state, files: action.files, status: LOADED}
        case 'submit':
            return{...state, uploading:true, pending:state.files, status:INIT}
        case 'next':
            return{...state, next:action.next, status:PENDING}
        case 'file-uploaded':
            return{
                ...state,
                next:null,
                pending:action.pending,
                upload:{
                    ...state.uploaded,
                    [action.prev.id]: action.prev.file,
                },
            }
        case 'files-uploaded':
            return { ...state, uploading: false, status: FILES_UPLOADED }
        case 'set-upload-error':{
            return{...state,uploadError: action.error, status: UPLOAD_ERROR}
        }
        default:
            return state
    }
}

const useFileHandlers = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    
    const onSubmit = useCallback(
        (e) => {
            e.preventDefault()
            console.log("File size: ", state.files.lenght)
            if(state.files.lenght){
                dispatch({type: 'submit'})
            }
            else{
                window.alert("No files uploaded")
            }
        },
        [state.files.lenght],
    );

    const onChange = (e) => {
        //e.persist()
        console.log("onchange: ". e)
        if(e.target.files.lenght){
            const arrFiles= Array.from(e.target.files)
            const files = arrFiles.map((file,index) => {
                const src = window.URL.createObjectURL(file)
                return {file, id:index,src}
            })
            dispatch({type:'load', files})
        }
    }
    // Sets the next file when it detects that its ready to go
    useEffect(() => {
        if (state.pending.length && state.next == null) {
          const next = state.pending[0]
          dispatch({ type: 'next', next })
        }
    }, [state.next, state.pending])

    const countRef = useRef(0)

    // Processes the next pending thumbnail when ready
    useEffect(() => {
        if (state.pending.length && state.next) {
            const { next } = state
            api
                .uploadFile(next)
                .then(() => {
                    const prev = next
                    logUploadedFile(++countRef.current)
                    const pending = state.pending.slice(1)
                    dispatch({ type: 'file-uploaded', prev, pending })
                })
                .catch((error) => {
                    console.error(error)
                    dispatch({ type: 'set-upload-error', error })
                })
        }
    }, [state])

    // Ends the upload process
    useEffect(() => {
        if (!state.pending.length && state.uploading) {
        dispatch({ type: 'files-uploaded' })
        }
    }, [state.pending.length, state.uploading])
    
    return {
        ...state,
        onSubmit,
        onChange,
    }
}

export default useFileHandlers