import * as Automerge from 'automerge'
import { NonEmptyArray } from 'fp-ts/es6/NonEmptyArray'
import { Tree } from 'fp-ts/es6/tree'

export type Legend = string

export type LeftHand = 'LeftHand'
export type RightHand = 'RightHand'
export const LeftHand: LeftHand = 'LeftHand'
export const RightHand: RightHand = 'RightHand'
export type Hand = LeftHand | RightHand
export interface Keyswitch {
  index: number
  hand?: Hand
  key: React.Key
  actuationCost: number
}

export type Kapp = UserlandKapp | SystemKapp

export interface UserlandKapp {
  type: 'UserlandKapp'
  idv0: string
  shortAsciiName: string
  legend: Legend
  instruction: DraftSyncRootMutator
}

export interface SystemKapp {
  type: 'SystemKapp'
  idv0: string
  shortAsciiName: string
  legend: Legend
  instruction: DraftAppStateMutator
}

export interface HuffmanWeighted {
  huffmanWeight: number
}

export interface WaypointValue extends HuffmanWeighted {
  kappIdv0: string | null
}

export type Waypoint = Tree<WaypointValue>

export type Keybinding = [Keyswitch, Waypoint]
export type Layout = Keybinding[]

export interface KeyswitchUp {
  type: 'KeyswitchUp'
  data: {
    timestamp: number
    keybinding: Keybinding
  }
  middlewarePayload?: string
}

export interface LoadSyncRootFromBrowserGit {
  type: 'LoadSyncRootFromBrowserGit'
  data: {
    timestamp: number
    syncRoot: AppSyncRoot
  }
}

export interface KeypadUp {
  type: 'KeypadUp'
  data: {
    timestamp: number
    keybinding: Keybinding
  }
}

export interface InputModeMenu {
  type: 'InputModeMenu'
  data: {
    timestamp: number
    keybinding: Keybinding
  }
}

export interface RunKapp {
  type: 'RunKapp'
  data: {
    timestamp: number
    kappIdv0: string
  }
}
export type AppAction =
  | KeyswitchUp
  | LoadSyncRootFromBrowserGit
  | KeypadUp
  | InputModeMenu
  | RunKapp

// TODO figure out how to define a recursive type like
// type TextTree = Automerge.List<TextTreeItem>
// type TextTreeItem = Automerge.Text | TextTree
export type SexpList = Automerge.List<any>
export type SexpTextAtom = Automerge.Text
export type SexpAtom = SexpTextAtom
export type Sexp = SexpList | SexpAtom

export type UUID = string

export interface SexpInfo {
  focusCursorIdx: number
}

export interface Keystroke {
  timestamp: number
  keyswitch: Keyswitch
  huffmanTreeDepth: number // starts at 0 for root
}

export interface AppSyncRoot {
  // the root userland sexp
  sexp: SexpList
  // keyed by Automerge.UUID (string)
  sexpMetadata: { [key: string]: SexpInfo }
  // stack of int list indices: empty means root
  sexpListZoomPath: number[]
  // zoom cursor boundary index. 0 for empty list, list.length for last item.
  // insertion happens at the cursor position. kapps operate on list index
  // cursor - 1.
  sexpZoomCursorIdx: number
  keystrokeHistory: Keystroke[]
}

export type Menu = Waypoint

export type InputMode = 'InsertMode' | 'MenuMode'

export interface AppTempRoot {
  kappIdv0Log: string[]
  // TODO rename "waypoint" to "menu" at some point
  keybindingBreadcrumbs: NonEmptyArray<Keybinding>
  menuIns: Waypoint[]
  sequenceFrequencies: { [key: string]: number }
  keyUpCount: number
  inputMode: InputMode
}

export interface AppState {
  syncRoot: Automerge.Doc<AppSyncRoot> | null
  tempRoot: AppTempRoot
}

export type AppReducer = React.Reducer<AppState, AppAction>

export type DraftSyncRootMutator = (
  draftState: AppSyncRoot,
  action: AppAction
) => void

export type DraftAppStateMutator = (
  draftState: AppState,
  action: AppAction
) => AppState

export type NGrammer = (log: string[]) => string[][]
