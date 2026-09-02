@extends('layouts.app')

@section('content')
<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-lg-7 col-md-9 col-sm-11">

<div class="container" style="padding-top: 80px;">
    <h2 class="text-center mb-5">Profile</h2>
    </div>
            <div class="card shadow-sm rounded-4 mb-5 p-4">
                <h4 class="mb-3">Profile Information</h4>
                <p><strong>Name:</strong> {{ auth()->user()->name }}</p>
                <p><strong>Email:</strong> {{ auth()->user()->email }}</p>
                <p><strong>Phone:</strong> {{ auth()->user()->phone ?? '-' }}</p>

                <button class="btn btn-outline-primary mb-3" type="button" data-bs-toggle="collapse" data-bs-target="#editProfileForm" aria-expanded="false" aria-controls="editProfileForm">
                    Edit Name / Email / Phone
                </button>

                <div class="collapse" id="editProfileForm">
                    <div class="card card-body bg-light rounded-4 shadow-sm">
                        @include('profile.partials.update-profile-information-form')
                    </div>
                </div>
            </div>

            <div class="card shadow-sm rounded-4 mb-5 p-4">
                <h4 class="mb-3">Password</h4>
                <button class="btn btn-outline-primary mb-3" type="button" data-bs-toggle="collapse" data-bs-target="#editPasswordForm" aria-expanded="false" aria-controls="editPasswordForm">
                    Change Password
                </button>

                <div class="collapse" id="editPasswordForm">
                    <div class="card card-body bg-light rounded-4 shadow-sm">
                        @include('profile.partials.update-password-form')
                    </div>
                </div>
            </div>

            <div class="card shadow-sm rounded-4 mb-5 p-4">
                <h4 class="mb-3">Delete Account</h4>
                <button class="btn btn-outline-danger mb-3" type="button" data-bs-toggle="collapse" data-bs-target="#deleteAccountForm" aria-expanded="false" aria-controls="deleteAccountForm">
                    Delete Account
                </button>

                <div class="collapse" id="deleteAccountForm">
                    <div class="card card-body bg-light rounded-4 shadow-sm">
                        @include('profile.partials.delete-user-form')
                    </div>
                </div>
            </div>

            <form method="POST" action="{{ route('logout') }}" class="text-center">
                @csrf
                <button type="submit" class="btn btn-danger px-5 py-2 fw-semibold rounded-pill">
                    {{ __('Logout') }}
                </button>
            </form>

        </div>
    </div>
</div>
@endsection
